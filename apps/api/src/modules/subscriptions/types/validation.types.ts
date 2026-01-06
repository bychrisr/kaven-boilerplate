export interface ValidationResult {
  isValid: boolean;
  error?: string;
  currentUsage?: number;
  limit?: number;
  currentPlan?: string;
  availableUpgrades?: Array<{
    id: string;
    code: string;
    name: string;
    price: number;
  }>;
}

export interface FeatureValidation {
  featureCode: string;
  isAvailable: boolean;
  currentUsage?: number;
  limit?: number;
  type: 'BOOLEAN' | 'QUOTA' | 'CUSTOM';
}

export interface UsageStats {
  tenantId: string;
  featureCode: string;
  currentUsage: number;
  limit: number;
  periodStart: Date;
  periodEnd: Date;
}
