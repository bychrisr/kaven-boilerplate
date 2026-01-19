'use client';

import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmailIntegrationCard } from './email-integration-card';

interface EmailIntegration {
  id: string;
  provider: 'RESEND' | 'SMTP' | 'POSTMARK';
  fromName: string;
  fromEmail: string;
  isActive: boolean;
  isPrimary: boolean;
  healthStatus: string | null;
  healthMessage: string | null;
  lastHealthCheck: string | null;
}

export function EmailIntegrationList() {
  const { data: integrations, isLoading } = useQuery<EmailIntegration[]>({
    queryKey: ['email-integrations'],
    queryFn: async () => {
      const res = await fetch('/api/settings/email');
      if (!res.ok) throw new Error('Failed to fetch integrations');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <h2 className="text-xl font-semibold">Email Providers</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your email service providers
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!integrations || integrations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No email integrations configured</p>
            </div>
          ) : (
            integrations.map((integration) => (
              <EmailIntegrationCard
                key={integration.id}
                integration={integration}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
