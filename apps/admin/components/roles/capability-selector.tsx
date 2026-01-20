'use client';

import { useCapabilitiesList } from '@/hooks/use-roles';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';
import { Label } from '@/components/ui/label';

interface CapabilitySelectorProps {
  selectedCapabilities: string[];
  onChange: (capabilities: string[]) => void;
  disabled?: boolean;
}

export function CapabilitySelector({ 
  selectedCapabilities, 
  onChange, 
  disabled 
}: CapabilitySelectorProps) {
  const { data: capabilities, isLoading } = useCapabilitiesList();

  // Group capabilities by category
  const groupedCapabilities = useMemo(() => {
    if (!capabilities) return {};
    
    return capabilities.reduce((acc, cap) => {
      if (!acc[cap.category]) {
        acc[cap.category] = [];
      }
      acc[cap.category].push(cap);
      return acc;
    }, {} as Record<string, typeof capabilities>);
  }, [capabilities]);

  const handleToggle = (capabilityId: string, checked: boolean) => {
    if (disabled) return;
    
    if (checked) {
      onChange([...selectedCapabilities, capabilityId]);
    } else {
      onChange(selectedCapabilities.filter(id => id !== capabilityId));
    }
  };

  const handleToggleCategory = (category: string, checked: boolean) => {
    if (disabled) return;
    
    const categoryCaps = groupedCapabilities[category].map(c => c.id);
    
    if (checked) {
      // Add all from category, avoiding duplicates
      const newSelected = [...selectedCapabilities];
      categoryCaps.forEach(id => {
        if (!newSelected.includes(id)) newSelected.push(id);
      });
      onChange(newSelected);
    } else {
      // Remove all from category
      onChange(selectedCapabilities.filter(id => !categoryCaps.includes(id)));
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedCapabilities).map(([category, caps]) => {
          const allSelected = caps.every(c => selectedCapabilities.includes(c.id));
          const someSelected = caps.some(c => selectedCapabilities.includes(c.id));
          
          return (
            <Card key={category} className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${category}`}
                    checked={allSelected ? true : (someSelected ? "indeterminate" : false)}
                    onCheckedChange={(checked) => handleToggleCategory(category, checked as boolean)}
                    disabled={disabled}
                  />
                  <CardTitle className="text-base font-semibold">
                    <Label htmlFor={`cat-${category}`} className="cursor-pointer">{category}</Label>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-3">
                  {caps.map(cap => (
                    <div key={cap.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={`cap-${cap.id}`}
                        checked={selectedCapabilities.includes(cap.id)}
                        onCheckedChange={(checked) => handleToggle(cap.id, checked as boolean)}
                        disabled={disabled}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label 
                          htmlFor={`cap-${cap.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {cap.code}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {cap.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
