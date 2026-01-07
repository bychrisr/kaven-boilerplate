'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { Cpu, MemoryStick, HardDrive, Activity } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  status: 'good' | 'warning' | 'critical';
}

function MetricCard({ title, value, subtitle, icon: Icon, status }: MetricCardProps) {
  const statusClasses = {
    good: 'border-success-light bg-success-lighter/50',
    warning: 'border-warning-light bg-warning-lighter/50',
    critical: 'border-error-light bg-error-lighter/50'
  };

  const iconClasses = {
    good: 'text-success-main',
    warning: 'text-warning-main',
    critical: 'text-error-main'
  };

  return (
    <div className={`rounded-lg border p-6 ${statusClasses[status]}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Icon className={`h-8 w-8 ${iconClasses[status]}`} />
      </div>
    </div>
  );
}

export function HardwareMetrics() {
  const t = useTranslations('Observability.hardware');
  
  const { data, isLoading } = useQuery({
    queryKey: ['hardware-metrics'],
    queryFn: observabilityApi.getHardwareMetrics,
    refetchInterval: 5000,
    retry: false
  });

  if (isLoading || !data) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  const { cpu, memory, disk, system } = data;

  const getStatus = (value: number, warning: number, critical: number): 'good' | 'warning' | 'critical' => {
    if (value >= critical) return 'critical';
    if (value >= warning) return 'warning';
    return 'good';
  };

  const formatBytes = (bytes: number): string => {
    const gb = bytes / (1024 ** 3);
    return `${gb.toFixed(1)}GB`;
  };

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  const formatSpeed = (bytesPerSec: number): string => {
    const mbps = bytesPerSec / (1024 * 1024);
    return `${mbps.toFixed(2)} MB/s`;
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('cpu')}
          value={`${cpu.usage}%`}
          subtitle={`${cpu.cores} ${t('cores')}`}
          icon={Cpu}
          status={getStatus(cpu.usage, 80, 90)}
        />

        <MetricCard
          title={t('memory')}
          value={`${memory.usagePercent}%`}
          subtitle={`${formatBytes(memory.used)} / ${formatBytes(memory.total)}`}
          icon={MemoryStick}
          status={getStatus(memory.usagePercent, 85, 95)}
        />

        <MetricCard
          title={t('disk')}
          value={`${disk.usagePercent}%`}
          subtitle={`${formatBytes(disk.used)} / ${formatBytes(disk.total)}`}
          icon={HardDrive}
          status={getStatus(disk.usagePercent, 80, 90)}
        />

        <MetricCard
          title={t('uptime')}
          value={formatUptime(system.uptime)}
          subtitle={system.platform}
          icon={Activity}
          status="good"
        />
      </div>

      {/* Advanced Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* CPU Temperature */}
        {cpu.temperature !== undefined && (
          <MetricCard
            title={t('temperature')}
            value={`${cpu.temperature}°C`}
            subtitle={t('cpuTemp')}
            icon={Cpu}
            status={getStatus(cpu.temperature, 70, 85)}
          />
        )}

        {/* Swap Memory */}
        {memory.swap && memory.swap.total > 0 && (
          <MetricCard
            title={t('swap')}
            value={`${memory.swap.usagePercent}%`}
            subtitle={`${formatBytes(memory.swap.used)} / ${formatBytes(memory.swap.total)}`}
            icon={MemoryStick}
            status={getStatus(memory.swap.usagePercent, 50, 75)}
          />
        )}

        {/* Disk I/O */}
        {(disk.readSpeed !== undefined || disk.writeSpeed !== undefined) && (
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{t('diskIO')}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">↓ {t('read')}:</span> {formatSpeed(disk.readSpeed || 0)}
                  </p>
                  <p className="text-sm text-foreground">
                    <span className="font-medium">↑ {t('write')}:</span> {formatSpeed(disk.writeSpeed || 0)}
                  </p>
                </div>
              </div>
              <HardDrive className="h-8 w-8 text-info-main" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
