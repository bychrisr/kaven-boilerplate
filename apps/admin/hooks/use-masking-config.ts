import { useQuery } from '@tanstack/react-query';

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
      const response = await fetch('/api/policies/masking-config');
      if (!response.ok) {
        throw new Error('Failed to fetch masking config');
      }
      return response.json();
    }
  });
}
