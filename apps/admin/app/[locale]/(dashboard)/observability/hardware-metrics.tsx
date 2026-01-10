'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { Cpu, MemoryStick, HardDrive, Activity, Thermometer } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { InfoTooltip } from '@/components/ui/info-tooltip';

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

  const getTrendColor = (status: 'good' | 'warning' | 'critical') => {
    if (status === 'critical') return 'text-red-600';
    if (status === 'warning') return 'text-yellow-600';
    return 'text-green-600';
  };

  const getIconBgColor = (status: 'good' | 'warning' | 'critical') => {
    if (status === 'critical') return 'bg-red-100 dark:bg-red-900/20';
    if (status === 'warning') return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-green-100 dark:bg-green-900/20';
  };



  const cpuStatus = getStatus(cpu.usage, 80, 90);
  const memoryStatus = getStatus(memory.usagePercent, 85, 95);
  const diskStatus = getStatus(disk.usagePercent, 80, 90);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          variant="outline"
          title={t('cpu')}
          value={`${cpu.usage}%`}
          subtitle={`${cpu.cores} ${t('cores')}`}
          icon={Cpu}
          iconClassName={`${getIconBgColor(cpuStatus)} ${getTrendColor(cpuStatus)}`}
          menuAction={<InfoTooltip content={t('cpuTooltip')} />}
        />

        <StatCard
          variant="outline"
          title={t('memory')}
          value={`${memory.usagePercent}%`}
          subtitle={`${formatBytes(memory.used)} / ${formatBytes(memory.total)}`}
          icon={MemoryStick}
          iconClassName={`${getIconBgColor(memoryStatus)} ${getTrendColor(memoryStatus)}`}
          menuAction={<InfoTooltip content={t('memoryTooltip')} />}
        />

        <StatCard
          variant="outline"
          title={t('disk')}
          value={`${disk.usagePercent}%`}
          subtitle={`${formatBytes(disk.used)} / ${formatBytes(disk.total)}`}
          icon={HardDrive}
          iconClassName={`${getIconBgColor(diskStatus)} ${getTrendColor(diskStatus)}`}
          menuAction={<InfoTooltip content={t('diskTooltip')} />}
        />

        <StatCard
          variant="outline"
          title={t('uptime')}
          value={formatUptime(system.uptime)}
          subtitle={system.platform}
          icon={Activity}
          iconClassName="bg-blue-100 dark:bg-blue-900/20 text-blue-600"
          menuAction={<InfoTooltip content={t('uptimeTooltip')} />}
        />
      </div>

      {/* Advanced Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* CPU Temperature */}
        {cpu.temperature !== undefined && (
          <StatCard
            variant="outline"
            title={t('temperature')}
            value={`${cpu.temperature}°C`}
            subtitle={t('cpuTemp')}
            icon={Thermometer}
            iconClassName={`${getIconBgColor(getStatus(cpu.temperature, 70, 85))} ${getTrendColor(getStatus(cpu.temperature, 70, 85))}`}
            menuAction={<InfoTooltip content={t('temperatureTooltip')} />}
          />
        )}

        {/* Swap Memory */}
        {memory.swap && memory.swap.total > 0 && (
          <StatCard
            variant="outline"
            title={t('swap')}
            value={`${memory.swap.usagePercent}%`}
            subtitle={`${formatBytes(memory.swap.used)} / ${formatBytes(memory.swap.total)}`}
            icon={MemoryStick}
            iconClassName={`${getIconBgColor(getStatus(memory.swap.usagePercent, 50, 75))} ${getTrendColor(getStatus(memory.swap.usagePercent, 50, 75))}`}
            menuAction={<InfoTooltip content={t('swapTooltip')} />}
          />
        )}

        {/* Disk I/O */}
        {(disk.readSpeed !== undefined || disk.writeSpeed !== undefined) && (
          <StatCard
            variant="outline"
            title={t('diskIO')}
            value={formatSpeed(disk.readSpeed || 0)}
            subtitle={`↑ ${formatSpeed(disk.writeSpeed || 0)}`}
            icon={HardDrive}
            iconClassName="bg-purple-100 dark:bg-purple-900/20 text-purple-600"
            menuAction={<InfoTooltip content={t('diskIOTooltip')} />}
          />
        )}
      </div>
    </div>
  );
}
