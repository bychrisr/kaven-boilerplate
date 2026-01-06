'use client';

import { useTranslations } from 'next-intl';
import { GoldenSignals } from './golden-signals';
import { NodeJsMetrics } from './nodejs-metrics';

export default function ObservabilityPage() {
  const t = useTranslations('Observability');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {/* Metrics */}
      <div className="space-y-8">
        {/* Golden Signals Section */}
        <GoldenSignals />

        {/* Node.js Metrics Section */}
        <NodeJsMetrics />
      </div>
    </div>
  );
}
