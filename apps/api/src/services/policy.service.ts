import { 
  PrismaClient,
  PolicyType,
  PolicyTargetType,
  PolicyEnforcement
} from '@prisma/client';
import { isIP } from 'net';
import { parse as parseCIDR } from 'ipaddr.js';

// Interfaces para conditions tipadas
interface IpWhitelistConditions {
  allowedIps?: string[]; // IPs permitidos
  blockedIps?: string[]; // IPs bloqueados (blacklist)
}

interface DeviceTrustConditions {
  requireTrusted?: boolean;
  minTrustLevel?: number;
}

interface TimeBasedConditions {
  allowedHours: [number, number][];
  allowedDays?: number[];
}

interface GeoRestrictionConditions {
  allowedCountries?: string[];
  blockedCountries?: string[];
}

type PolicyConditions = 
  | IpWhitelistConditions 
  | DeviceTrustConditions 
  | TimeBasedConditions 
  | GeoRestrictionConditions;

interface CreatePolicyInput {
  name: string;
  description?: string;
  type: PolicyType;
  targetType: PolicyTargetType;
  targetId?: string;
  conditions: PolicyConditions;
  enforcement: PolicyEnforcement;
  isActive?: boolean;
}

interface UpdatePolicyInput {
  name?: string;
  description?: string;
  conditions?: PolicyConditions;
  enforcement?: PolicyEnforcement;
  isActive?: boolean;
}

interface PolicyEvaluationContext {
  userId: string;
  ipAddress?: string;
  deviceId?: string;
  timestamp?: Date;
  userAgent?: string;
}

interface PolicyEvaluationResult {
  allowed: boolean;
  reason?: string;
  policyId?: string;
  policyName?: string;
}

export class PolicyService {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }
  /**
   * Cria uma nova policy
   */
  async createPolicy(data: CreatePolicyInput): Promise<Policy> {
    // Validar condições baseado no tipo
    this.validateConditions(data.type, data.conditions);

    const policy = await this.prisma.policy.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        targetType: data.targetType,
        targetId: data.targetId,
        conditions: data.conditions,
        enforcement: data.enforcement,
        isActive: data.isActive ?? true,
      },
      include: {
        ipWhitelists: true,
        deviceTracking: true,
      },
    });

    return policy;
  }

  /**
   * Lista policies com filtros
   */
  async listPolicies(filters?: {
    type?: PolicyType;
    targetType?: PolicyTargetType;
    targetId?: string;
    isActive?: boolean;
  }) {
    const where: any = {};

    if (filters?.type) where.type = filters.type;
    if (filters?.targetType) where.targetType = filters.targetType;
    if (filters?.targetId) where.targetId = filters.targetId;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    return this.prisma.policy.findMany({
      where,
      include: {
        ipWhitelists: true,
        deviceTracking: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Busca policy por ID
   */
  async getPolicyById(id: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { id },
      include: {
        ipWhitelists: true,
        deviceTracking: true,
      },
    });

    if (!policy) {
      throw new Error('Policy not found');
    }

    return policy;
  }

  /**
   * Atualiza policy
   */
  async updatePolicy(id: string, data: UpdatePolicyInput) {
    const policy = await this.getPolicyById(id);

    // Se estiver atualizando condições, validar
    if (data.conditions) {
      this.validateConditions(policy.type, data.conditions);
    }

    return this.prisma.policy.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        conditions: data.conditions,
        enforcement: data.enforcement,
        isActive: data.isActive,
      },
      include: {
        ipWhitelists: true,
        deviceTracking: true,
      },
    });
  }

  /**
   * Deleta policy
   */
  async deletePolicy(id: string) {
    await this.getPolicyById(id); // Verificar se existe

    return this.prisma.policy.delete({
      where: { id },
    });
  }

  /**
   * Avalia se uma policy permite acesso
   */
  async evaluatePolicy(
    policyId: string,
    context: PolicyEvaluationContext
  ): Promise<PolicyEvaluationResult> {
    const policy = await this.getPolicyById(policyId);

    if (!policy.isActive) {
      return { allowed: true, reason: 'Policy is inactive' };
    }

    let result: PolicyEvaluationResult;

    switch (policy.type) {
      case PolicyType.IP_WHITELIST:
        result = await this.evaluateIpWhitelist(policy, context);
        break;
      case PolicyType.DEVICE_TRUST:
        result = await this.evaluateDeviceTrust(policy, context);
        break;
      case PolicyType.TIME_BASED:
        result = this.evaluateTimeBased(policy, context);
        break;
      default:
        result = { allowed: true, reason: `Policy type ${policy.type} not implemented yet` };
    }

    // Aplicar enforcement
    if (policy.enforcement === PolicyEnforcement.DENY) {
      // DENY policy: se negou, retornar negação
      if (!result.allowed) {
        return {
          allowed: false,
          reason: result.reason,
          policyId: policy.id,
          policyName: policy.name,
        };
      }
      // DENY policy passou (não negou), continuar
      return result;
    }

    if (policy.enforcement === PolicyEnforcement.ALLOW) {
      // ALLOW policy: se permitiu, retornar permissão
      if (result.allowed) {
        return {
          allowed: true,
          reason: result.reason,
          policyId: policy.id,
          policyName: policy.name,
        };
      }
      // ALLOW policy não permitiu, continuar
      return result;
    }

    return result;
  }

  /**
   * Avalia todas as policies aplicáveis a um capability/space
   */
  async evaluatePolicies(
    targetType: PolicyTargetType,
    targetId: string,
    context: PolicyEvaluationContext
  ): Promise<PolicyEvaluationResult> {
    const policies = await this.prisma.policy.findMany({
      where: {
        targetType,
        targetId,
        isActive: true,
      },
      include: {
        ipWhitelists: true,
        deviceTracking: true,
      },
    });

    // Avaliar policies em ordem: DENY primeiro, depois ALLOW
    const denyPolicies = policies.filter((p) => p.enforcement === 'DENY');
    const allowPolicies = policies.filter((p) => p.enforcement === 'ALLOW');

    // Se qualquer DENY policy negar, acesso é negado
    for (const policy of denyPolicies) {
      const result = await this.evaluatePolicy(policy.id, context);
      if (!result.allowed) {
        return result;
      }
    }

    // Se houver ALLOW policies, pelo menos uma deve permitir
    if (allowPolicies.length > 0) {
      for (const policy of allowPolicies) {
        const result = await this.evaluatePolicy(policy.id, context);
        if (result.allowed) {
          return result;
        }
      }
      return {
        allowed: false,
        reason: 'No ALLOW policy matched',
      };
    }

    // Se não há policies ou todas passaram, permitir
    return { allowed: true };
  }

  /**
   * Valida condições de uma policy baseado no tipo
   */
  private validateConditions(type: PolicyType, conditions: any) {
    switch (type) {
      case PolicyType.IP_WHITELIST:
        if (!conditions.allowedIps && !conditions.blockedIps) {
          throw new Error('IP_WHITELIST policy requires allowedIps or blockedIps array');
        }
        // Validar cada IP/CIDR em allowedIps
        if (conditions.allowedIps) {
          for (const ip of conditions.allowedIps) {
            if (!this.isValidIpOrCIDR(ip)) {
              throw new Error(`Invalid IP or CIDR in allowedIps: ${ip}`);
            }
          }
        }
        // Validar cada IP/CIDR em blockedIps
        if (conditions.blockedIps) {
          for (const ip of conditions.blockedIps) {
            if (!this.isValidIpOrCIDR(ip)) {
              throw new Error(`Invalid IP or CIDR in blockedIps: ${ip}`);
            }
          }
        }
        break;

      case PolicyType.DEVICE_TRUST:
        if (!conditions.requireTrusted && conditions.minTrustLevel === undefined) {
          throw new Error('DEVICE_TRUST policy requires requireTrusted or minTrustLevel');
        }
        break;

      case PolicyType.TIME_BASED:
        if (!conditions.allowedHours || !Array.isArray(conditions.allowedHours)) {
          throw new Error('TIME_BASED policy requires allowedHours array');
        }
        break;


    }
  }

  /**
   * Avalia IP Whitelist policy
   */
  private async evaluateIpWhitelist(
    policy: Policy,
    context: PolicyEvaluationContext
  ): Promise<PolicyEvaluationResult> {
    if (!context.ipAddress) {
      return { allowed: false, reason: 'No IP address provided' };
    }

    if (!policy.conditions) {
      return { allowed: false, reason: 'Policy has no conditions' };
    }

    const conditions = policy.conditions as unknown as IpWhitelistConditions;
    const allowedIps = conditions.allowedIps || [];
    const blockedIps = conditions.blockedIps || [];

    // Verificar blacklist primeiro (prioridade)
    for (const blockedIp of blockedIps) {
      if (this.ipMatches(context.ipAddress, blockedIp)) {
        return { allowed: false, reason: `IP ${context.ipAddress} is blocked` };
      }
    }

    // Se não há whitelist, permitir (apenas blacklist ativa)
    if (allowedIps.length === 0) {
      return { allowed: true, reason: 'IP not in blacklist' };
    }

    // Verificar whitelist
    for (const allowedIp of allowedIps) {
      if (this.ipMatches(context.ipAddress, allowedIp)) {
        return { allowed: true, reason: `IP ${context.ipAddress} is whitelisted` };
      }
    }

    return {
      allowed: false,
      reason: `IP ${context.ipAddress} is not in whitelist`,
    };
  }

  /**
   * Avalia Device Trust policy
   */
  private async evaluateDeviceTrust(
    policy: Policy,
    context: PolicyEvaluationContext
  ): Promise<PolicyEvaluationResult> {
    if (!context.deviceId) {
      return { allowed: false, reason: 'No device ID provided' };
    }

    const device = await this.prisma.policyDeviceTracking.findUnique({
      where: { deviceId: context.deviceId },
    });

    if (!device) {
      return { allowed: false, reason: 'Device not recognized' };
    }

    if (!policy.conditions) {
      return { allowed: false, reason: 'Policy has no conditions' };
    }

    const conditions = policy.conditions as unknown as DeviceTrustConditions;
    const requireTrusted = conditions.requireTrusted ?? true;

    if (requireTrusted && !device.isTrusted) {
      return { allowed: false, reason: 'Device is not trusted' };
    }

    return { allowed: true, reason: 'Device is trusted' };
  }

  /**
   * Avalia Time-based policy
   */
  private evaluateTimeBased(
    policy: Policy,
    context: PolicyEvaluationContext
  ): PolicyEvaluationResult {
    const now = context.timestamp || new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

    if (!policy.conditions) {
      return { allowed: false, reason: 'Policy has no conditions' };
    }

    const conditions = policy.conditions as unknown as TimeBasedConditions;
    const allowedHours = conditions.allowedHours || [];
    const allowedDays = conditions.allowedDays || [0, 1, 2, 3, 4, 5, 6];

    // Verificar dia da semana
    if (!allowedDays.includes(currentDay)) {
      return { allowed: false, reason: 'Access not allowed on this day' };
    }

    // Verificar hora
    const isHourAllowed = allowedHours.some((range: any) => {
      const [start, end] = range;
      return currentHour >= start && currentHour < end;
    });

    if (!isHourAllowed) {
      return {
        allowed: false,
        reason: `Access not allowed at ${currentHour}:00`,
      };
    }

    return { allowed: true, reason: 'Within allowed time window' };
  }

  /**
   * Verifica se IP é válido ou CIDR válido
   */
  private isValidIpOrCIDR(ip: string): boolean {
    try {
      // Tentar como IP simples primeiro
      if (isIP(ip)) {
        return true;
      }

      // Tentar como CIDR (ex: 192.168.1.0/24)
      if (ip.includes('/')) {
        const [network, bits] = ip.split('/');
        const bitsNum = parseInt(bits, 10);
        
        // Validar bits
        if (isNaN(bitsNum) || bitsNum < 0 || bitsNum > 32) {
          return false;
        }
        
        // Validar network IP
        if (!isIP(network)) {
          return false;
        }
        
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Verifica se um IP corresponde a um IP/CIDR permitido
   */
  private ipMatches(ip: string, allowedIp: string): boolean {
    try {
      // Se for IP exato
      if (ip === allowedIp) return true;

      // Se for CIDR, verificar se IP está na range
      if (allowedIp.includes('/')) {
        const [network, bits] = allowedIp.split('/');
        const ipAddr = parseCIDR(ip);
        const networkAddr = parseCIDR(network);

        // Simplificação: comparar primeiros bits
        // Em produção, usar biblioteca como 'ip-range-check'
        return ipAddr.toString().startsWith(networkAddr.toString().split('.').slice(0, parseInt(bits) / 8).join('.'));
      }

      return false;
    } catch {
      return false;
    }
  }
}
