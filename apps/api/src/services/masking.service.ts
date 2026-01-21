import { MASKING_CONFIG, MaskingType, MaskingRule } from '../config/masking.config';

export class MaskingService {
  /**
   * Mascara um valor baseado no tipo de mascaramento
   */
  maskValue(value: any, type: MaskingType): any {
    if (value === null || value === undefined) return value;
    const str = String(value);

    switch (type) {
      case MaskingType.EMAIL:
        return this.maskEmail(str);
      case MaskingType.PHONE:
        return this.maskPhone(str);
      case MaskingType.NAME:
        return this.maskName(str);
      case MaskingType.TOKEN:
        return this.maskToken(str);
      case MaskingType.ADDRESS:
        return this.maskAddress(str);
      case MaskingType.GENERIC:
      default:
        return '********';
    }
  }

  /**
   * Mascara um objeto (ou array) recursivamente baseado nas regras configuradas
   */
  maskObject(entityName: string, data: any, allowedCapabilities: string[]): any {
    if (!data) return data;

    // Se for um array, processar cada item
    if (Array.isArray(data)) {
      return data.map(item => this.maskObject(entityName, item, allowedCapabilities));
    }

    // Se não for um objeto, retornar como está
    if (typeof data !== 'object') return data;

    const config = MASKING_CONFIG[entityName];
    if (!config) return data;

    // Se o usuário for Super Admin (cap '*'), não mascarar nada
    if (allowedCapabilities.includes('*')) return data;

    const maskedData = { ...data };

    for (const [field, rule] of Object.entries(config)) {
      if (field in maskedData) {
        const hasPermission = allowedCapabilities.includes(rule.requiredCapability);
        if (!hasPermission) {
          maskedData[field] = this.maskValue(maskedData[field], rule.type);
        }
      }
    }

    return maskedData;
  }

  private maskEmail(email: string): string {
    const [user, domain] = email.split('@');
    if (!domain) return '***@***';
    const visibleLength = Math.max(1, Math.floor(user.length / 3));
    return `${user.substring(0, visibleLength)}***@${domain}`;
  }

  private maskPhone(phone: string): string {
    // Ex: +55 (11) 99999-9999 -> +55 (11) *****-9999
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 4) return '****';
    return phone.replace(/\d(?=\d{4})/g, '*');
  }

  private maskName(name: string): string {
    const parts = name.split(' ');
    if (parts.length === 1) return `${parts[0].charAt(0)}***`;
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}***`;
  }

  private maskToken(token: string): string {
    if (token.length <= 8) return '********';
    return `${token.substring(0, 4)}****${token.substring(token.length - 4)}`;
  }

  private maskAddress(address: string): string {
    // Mostrar apenas o início (ex: rua) e ocultar o resto
    if (address.length <= 10) return '********';
    return `${address.substring(0, 8)}... (Ocultado)`;
  }
}

export const maskingService = new MaskingService();
