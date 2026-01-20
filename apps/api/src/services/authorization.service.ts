/**
 * Authorization Service
 * 
 * Motor de autorização baseado em Capabilities para o sistema Kaven.
 * 
 * Responsabilidades:
 * - Verificar permissões (capabilities) de usuários
 * - Validar políticas de segurança (IP, MFA, Device, Horário)
 * - Registrar auditoria completa de todas as verificações
 * - Rastrear dispositivos e validar IPs
 * 
 * Ordem de Prioridade:
 * 1. SUPER_ADMIN → Acesso total (bypass)
 * 2. DENY Grants → Bloqueio absoluto
 * 3. ADD Grants → Exceções temporárias
 * 4. Role Capabilities → Permissões padrão
 * 5. DENY (default) → Se nada acima, nega
 */

import { PrismaClient, CapabilityScope, GrantType, AccessLevel, Role } from '@prisma/client';
import crypto from 'crypto';
import {
  AuthorizationContext,
  AuthorizationResult,
  AuthorizationReason,
  CheckCapabilityParams,
  DeviceInfo,
  TrackDeviceParams,
  ValidateIpParams,
  AuditCapabilityParams,
  PolicyValidationResult,
  UserCapabilities,
  AuthorizationError,
} from '../types/authorization.types';

const prisma = new PrismaClient();

export class AuthorizationService {
  /**
   * Verifica se um usuário possui uma capability específica
   * 
   * @param params - Parâmetros de verificação
   * @returns Resultado da autorização
   */
  async checkCapability(params: CheckCapabilityParams): Promise<AuthorizationResult> {
    const { userId, capabilityCode, spaceId, scope = CapabilityScope.SPACE, context } = params;

    try {
      // 1. Buscar usuário
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
          twoFactorEnabled: true,
        },
      });

      if (!user) {
        await this.auditCapabilityCheck({
          userId,
          capabilityId: 'unknown',
          action: 'check',
          result: 'denied',
          reason: 'NO_PERMISSION',
          context,
        });
        return { allowed: false, reason: 'NO_PERMISSION' };
      }

      // 2. SUPER_ADMIN bypass (acesso total)
      if (user.role === Role.SUPER_ADMIN) {
        await this.auditCapabilityCheck({
          userId,
          capabilityId: 'any',
          spaceId,
          action: 'granted',
          result: 'allowed',
          reason: 'SUPER_ADMIN',
          context,
        });
        return {
          allowed: true,
          reason: 'SUPER_ADMIN',
          accessLevel: AccessLevel.READ_WRITE,
        };
      }

      // 3. Buscar capability
      const capability = await prisma.capability.findUnique({
        where: { code: capabilityCode },
        select: {
          id: true,
          code: true,
          sensitivity: true,
          requiresMFA: true,
          requiresApproval: true,
          isActive: true,
        },
      });

      if (!capability) {
        await this.auditCapabilityCheck({
          userId,
          capabilityId: 'unknown',
          spaceId,
          action: 'check',
          result: 'denied',
          reason: 'CAPABILITY_NOT_FOUND',
          context,
        });
        return { allowed: false, reason: 'CAPABILITY_NOT_FOUND' };
      }

      if (!capability.isActive) {
        await this.auditCapabilityCheck({
          userId,
          capabilityId: capability.id,
          spaceId,
          action: 'check',
          result: 'denied',
          reason: 'CAPABILITY_INACTIVE',
          context,
        });
        return { allowed: false, reason: 'CAPABILITY_INACTIVE' };
      }

      // 4. Verificar DENY grants (mais alta prioridade)
      const denyGrant = await prisma.grant.findFirst({
        where: {
          userId,
          capabilityId: capability.id,
          type: GrantType.DENY,
          status: 'ACTIVE',
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      });

      if (denyGrant) {
        await this.auditCapabilityCheck({
          userId,
          capabilityId: capability.id,
          spaceId,
          action: 'denied',
          result: 'denied',
          reason: 'DENY_GRANT',
          grantId: denyGrant.id,
          context,
        });
        return {
          allowed: false,
          reason: 'DENY_GRANT',
          metadata: {
            grantId: denyGrant.id,
          },
        };
      }

      // 5. Verificar ADD grants (exceções temporárias)
      const addGrant = await prisma.grant.findFirst({
        where: {
          userId,
          capabilityId: capability.id,
          type: GrantType.ADD,
          status: 'ACTIVE',
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      });

      if (addGrant) {
        // Validar políticas antes de conceder
        const policyCheck = await this.validatePolicies(capability, context);
        if (!policyCheck.allowed) {
          await this.auditCapabilityCheck({
            userId,
            capabilityId: capability.id,
            spaceId,
            action: 'denied',
            result: 'denied',
            reason: policyCheck.reason!,
            grantId: addGrant.id,
            context,
            metadata: { failedPolicy: policyCheck.failedPolicy },
          });
          return {
            allowed: false,
            reason: policyCheck.reason!,
            metadata: { failedPolicy: policyCheck.failedPolicy },
          };
        }

        await this.auditCapabilityCheck({
          userId,
          capabilityId: capability.id,
          spaceId,
          action: 'granted',
          result: 'allowed',
          reason: 'ADD_GRANT',
          grantId: addGrant.id,
          context,
        });

        return {
          allowed: true,
          reason: 'ADD_GRANT',
          accessLevel: addGrant.accessLevel,
          grantId: addGrant.id,
          metadata: {
            expiresAt: addGrant.expiresAt || undefined,
            grantedBy: addGrant.grantedBy,
          },
        };
      }

      // 6. Verificar role capabilities (permissões padrão)
      if (spaceId) {
        const userSpaceRole = await prisma.userSpaceRole.findFirst({
          where: { userId, spaceId },
          include: {
            role: {
              include: {
                capabilities: {
                  where: {
                    capability: {
                      code: capabilityCode,
                    },
                  },
                  include: {
                    capability: true,
                  },
                },
              },
            },
          },
        });

        if (userSpaceRole && userSpaceRole.role.capabilities.length > 0) {
          // Validar políticas
          const policyCheck = await this.validatePolicies(capability, context);
          if (!policyCheck.allowed) {
            await this.auditCapabilityCheck({
              userId,
              capabilityId: capability.id,
              spaceId,
              action: 'denied',
              result: 'denied',
              reason: policyCheck.reason!,
              context,
              metadata: { failedPolicy: policyCheck.failedPolicy },
            });
            return {
              allowed: false,
              reason: policyCheck.reason!,
              metadata: { failedPolicy: policyCheck.failedPolicy },
            };
          }

          await this.auditCapabilityCheck({
            userId,
            capabilityId: capability.id,
            spaceId,
            action: 'granted',
            result: 'allowed',
            reason: 'ROLE_CAPABILITY',
            context,
          });

          return {
            allowed: true,
            reason: 'ROLE_CAPABILITY',
            accessLevel: AccessLevel.READ_WRITE,
            metadata: {
              requiresMFA: capability.requiresMFA,
            },
          };
        }
      }

      // 7. Default: DENY
      await this.auditCapabilityCheck({
        userId,
        capabilityId: capability.id,
        spaceId,
        action: 'denied',
        result: 'denied',
        reason: 'NO_PERMISSION',
        context,
      });

      return { allowed: false, reason: 'NO_PERMISSION' };
    } catch (error) {
      console.error('Error in checkCapability:', error);
      // Fail secure: em caso de erro, negar acesso
      return { allowed: false, reason: 'NO_PERMISSION' };
    }
  }

  /**
   * Valida políticas de segurança (MFA, IP, Device, etc)
   * 
   * @param capability - Capability a ser verificada
   * @param context - Contexto da requisição
   * @returns Resultado da validação
   */
  private async validatePolicies(
    capability: { id: string; requiresMFA: boolean },
    context?: AuthorizationContext
  ): Promise<PolicyValidationResult> {
    if (!context) {
      return { allowed: true };
    }

    // 1. Verificar MFA Required
    if (capability.requiresMFA) {
      if (!context.user?.twoFactorEnabled) {
        return { allowed: false, reason: 'MFA_NOT_ENABLED' };
      }

      if (!context.session?.mfaVerified) {
        return { allowed: false, reason: 'MFA_NOT_VERIFIED' };
      }

      // Verificar se MFA não expirou (15 minutos)
      if (context.session.mfaVerifiedAt) {
        const mfaAge = Date.now() - context.session.mfaVerifiedAt.getTime();
        const fifteenMinutes = 15 * 60 * 1000;
        if (mfaAge > fifteenMinutes) {
          return { allowed: false, reason: 'MFA_EXPIRED' };
        }
      }
    }

    // 2. Buscar e validar policies aplicáveis
    const policies = await prisma.policy.findMany({
      where: {
        isActive: true,
        targetId: capability.id,
      },
      include: {
        ipWhitelists: true,
        deviceTracking: true,
      },
    });

    for (const policy of policies) {
      // IP Restriction
      if (policy.type === 'IP_RESTRICTION' && context.ip) {
        const ipAllowed = await this.validateIpRestriction({
          ip: context.ip,
          whitelists: policy.ipWhitelists,
        });

        if (!ipAllowed) {
          if (policy.enforcement === 'DENY') {
            return {
              allowed: false,
              reason: 'IP_NOT_ALLOWED',
              failedPolicy: {
                id: policy.id,
                type: policy.type,
                enforcement: policy.enforcement,
              },
            };
          } else if (policy.enforcement === 'REQUIRE_MFA') {
            // Escalar para MFA
            if (!context.session?.mfaVerified) {
              return { allowed: false, reason: 'MFA_NOT_VERIFIED' };
            }
          }
        }
      }

      // Device Restriction
      if (policy.type === 'DEVICE_RESTRICTION' && context.userAgent && context.ip) {
        const deviceInfo = await this.trackDevice({
          userId: context.userId,
          userAgent: context.userAgent,
          ip: context.ip,
        });

        if (!deviceInfo.isTrusted) {
          if (policy.enforcement === 'DENY') {
            return {
              allowed: false,
              reason: 'DEVICE_NOT_TRUSTED',
              failedPolicy: {
                id: policy.id,
                type: policy.type,
                enforcement: policy.enforcement,
              },
            };
          }
        }
      }

      // Time Restriction
      if (policy.type === 'TIME_RESTRICTION') {
        const timeAllowed = this.validateTimeRestriction(policy.conditions as any);
        if (!timeAllowed && policy.enforcement === 'DENY') {
          return {
            allowed: false,
            reason: 'TIME_RESTRICTION',
            failedPolicy: {
              id: policy.id,
              type: policy.type,
              enforcement: policy.enforcement,
            },
          };
        }
      }
    }

    return { allowed: true };
  }

  /**
   * Valida restrição de horário
   * 
   * @param conditions - Condições da policy
   * @returns true se horário permitido
   */
  private validateTimeRestriction(conditions: {
    allowedHours?: string;
    timezone?: string;
  }): boolean {
    if (!conditions.allowedHours) {
      return true;
    }

    // Exemplo: "09:00-18:00"
    const [start, end] = conditions.allowedHours.split('-');
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    return currentTime >= startTime && currentTime <= endTime;
  }

  /**
   * Obtém todas as capabilities de um usuário em um space
   * 
   * @param userId - ID do usuário
   * @param spaceId - ID do space (opcional)
   * @returns Lista de códigos de capabilities
   */
  async getUserCapabilities(userId: string, spaceId?: string): Promise<string[]> {
    try {
      // 1. Verificar se é SUPER_ADMIN
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (user?.role === Role.SUPER_ADMIN) {
        return ['*']; // Acesso total
      }

      const capabilityCodes = new Set<string>();

      // 2. Buscar capabilities via roles
      if (spaceId) {
        const userSpaceRoles = await prisma.userSpaceRole.findMany({
          where: { userId, spaceId },
          include: {
            role: {
              include: {
                capabilities: {
                  include: {
                    capability: {
                      select: { code: true, isActive: true },
                    },
                  },
                },
              },
            },
          },
        });

        for (const userSpaceRole of userSpaceRoles) {
          for (const roleCapability of userSpaceRole.role.capabilities) {
            if (roleCapability.capability.isActive) {
              capabilityCodes.add(roleCapability.capability.code);
            }
          }
        }
      }

      // 3. Aplicar ADD grants
      const addGrants = await prisma.grant.findMany({
        where: {
          userId,
          type: GrantType.ADD,
          status: 'ACTIVE',
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        include: {
          capability: {
            select: { code: true },
          },
        },
      });

      for (const grant of addGrants) {
        if (grant.capability) {
          capabilityCodes.add(grant.capability.code);
        }
      }

      // 4. Remover DENY grants
      const denyGrants = await prisma.grant.findMany({
        where: {
          userId,
          type: GrantType.DENY,
          status: 'ACTIVE',
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        include: {
          capability: {
            select: { code: true },
          },
        },
      });

      for (const grant of denyGrants) {
        if (grant.capability) {
          capabilityCodes.delete(grant.capability.code);
        }
      }

      return Array.from(capabilityCodes);
    } catch (error) {
      console.error('Error in getUserCapabilities:', error);
      return [];
    }
  }

  /**
   * Rastreia dispositivo do usuário
   * 
   * @param params - Parâmetros de rastreamento
   * @returns Informações do dispositivo
   */
  async trackDevice(params: TrackDeviceParams): Promise<DeviceInfo> {
    const { userId, userAgent, ip } = params;

    // Gerar deviceId único (hash de UserAgent + IP)
    const deviceId = crypto
      .createHash('sha256')
      .update(`${userAgent}:${ip}`)
      .digest('hex');

    // Detectar tipo de dispositivo
    const deviceType = this.detectDeviceType(userAgent);

    // Buscar ou criar device tracking
    let device = await prisma.policyDeviceTracking.findUnique({
      where: { deviceId },
    });

    if (device) {
      // Atualizar lastSeenAt
      device = await prisma.policyDeviceTracking.update({
        where: { deviceId },
        data: { lastSeenAt: new Date() },
      });
    } else {
      // Criar novo device
      device = await prisma.policyDeviceTracking.create({
        data: {
          userId,
          deviceId,
          deviceName: this.getDeviceName(userAgent),
          deviceType,
          isTrusted: false, // Novo dispositivo não é confiável por padrão
          metadata: { userAgent, ip },
        },
      });
    }

    return {
      deviceId: device.deviceId,
      deviceName: device.deviceName || undefined,
      deviceType: device.deviceType as any,
      isTrusted: device.isTrusted,
      firstSeenAt: device.firstSeenAt,
      lastSeenAt: device.lastSeenAt,
    };
  }

  /**
   * Detecta tipo de dispositivo pelo UserAgent
   */
  private detectDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'mobile';
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return 'tablet';
    }
    return 'desktop';
  }

  /**
   * Extrai nome amigável do dispositivo
   */
  private getDeviceName(userAgent: string): string {
    const ua = userAgent.toLowerCase();
    
    // Browser
    let browser = 'Unknown';
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';
    
    // OS
    let os = 'Unknown';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac')) os = 'MacOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
    
    return `${browser} on ${os}`;
  }

  /**
   * Valida se IP está na whitelist
   * 
   * @param params - Parâmetros de validação
   * @returns true se IP permitido
   */
  async validateIpRestriction(params: ValidateIpParams): Promise<boolean> {
    const { ip, whitelists } = params;

    if (!whitelists || whitelists.length === 0) {
      return true; // Sem restrições
    }

    for (const whitelist of whitelists) {
      if (!whitelist.isActive) continue;

      // Verificar se é CIDR notation (ex: 192.168.1.0/24)
      if (whitelist.ipAddress.includes('/')) {
        if (this.isIpInCidr(ip, whitelist.ipAddress)) {
          return true;
        }
      } else {
        // Match exato
        if (ip === whitelist.ipAddress) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Verifica se IP está em range CIDR
   */
  private isIpInCidr(ip: string, cidr: string): boolean {
    const [range, bits] = cidr.split('/');
    const mask = ~(2 ** (32 - parseInt(bits)) - 1);
    
    const ipNum = this.ipToNumber(ip);
    const rangeNum = this.ipToNumber(range);
    
    return (ipNum & mask) === (rangeNum & mask);
  }

  /**
   * Converte IP string para número
   */
  private ipToNumber(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
  }

  /**
   * Registra evento de auditoria
   * 
   * @param params - Parâmetros de auditoria
   */
  private async auditCapabilityCheck(params: AuditCapabilityParams): Promise<void> {
    try {
      await prisma.capabilityAuditEvent.create({
        data: {
          userId: params.userId,
          capabilityId: params.capabilityId,
          spaceId: params.spaceId,
          action: params.action,
          result: params.result,
          reason: params.reason,
          grantId: params.grantId,
          ipAddress: params.context?.ip,
          userAgent: params.context?.userAgent,
          deviceId: params.context?.deviceId,
          deviceType: params.context?.deviceType,
          origin: params.context?.origin,
          metadata: params.metadata as any,
        },
      });
    } catch (error) {
      // Não falhar a autorização se auditoria falhar, mas logar erro
      console.error('Failed to audit capability check:', error);
    }
  }
}

// Exportar instância singleton
export const authorizationService = new AuthorizationService();
