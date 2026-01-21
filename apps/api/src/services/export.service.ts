import { auditService } from '../modules/audit/services/audit.service';

export interface ExportOptions {
  headers: Record<string, string>; // { fieldName: 'Column Title' }
  data: any[];
  entity: string;
  actorId: string;
  tenantId: string;
  ipAddress?: string;
  userAgent?: string;
  filename?: string;
}

export class ExportService {
  /**
   * Gera um CSV a partir de um array de objetos e registra a auditoria.
   */
  async generateCSV(options: ExportOptions): Promise<string> {
    const { headers, data, entity, actorId, tenantId, ipAddress, userAgent } = options;

    const headerKeys = Object.keys(headers);
    const headerRow = headerKeys.map(key => `"${headers[key]}"`).join(',');
    
    const dataRows = data.map(row => {
      return headerKeys.map(key => {
        const val = row[key];
        if (val === null || val === undefined) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
    });

    const csvContent = [headerRow, ...dataRows].join('\n');

    // Registrar auditoria
    await auditService.log({
      action: `${entity.toLowerCase()}.export`,
      entity: entity,
      entityId: 'system',
      actorId: actorId,
      tenantId: tenantId,
      ipAddress: ipAddress,
      userAgent: userAgent,
      metadata: {
        recordCount: data.length,
        format: 'CSV',
        fields: headerKeys
      }
    });

    return csvContent;
  }
}

export const exportService = new ExportService();
