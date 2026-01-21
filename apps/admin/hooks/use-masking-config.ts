import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface MaskingRule {
  type: string;
  requiredCapability: string;
}

export interface MaskingConfigData {
  config: {
    [entity: string]: {
      [field: string]: MaskingRule;
    };
  };
}

export function useMaskingConfig() {
  return useQuery<MaskingConfigData>({
    queryKey: ['masking-config'],
    queryFn: async () => {
      const response = await api.get<MaskingConfigData>('/api/policies/masking-config');
      return response.data;
    }
  });
}
