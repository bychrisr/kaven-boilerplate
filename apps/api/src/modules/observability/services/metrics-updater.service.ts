import { hardwareMetricsService } from './hardware-metrics.service';
import * as metrics from '../../../lib/metrics';

/**
 * Serviço para atualização automática de métricas Prometheus
 * Atualiza métricas de hardware a cada 10 segundos
 */
export class MetricsUpdaterService {
  private intervalId: NodeJS.Timeout | null = null;

  /**
   * Inicia atualização automática de métricas
   */
  start() {
    if (this.intervalId) {
      console.log('[MetricsUpdater] Already running');
      return;
    }

    console.log('[MetricsUpdater] Starting automatic metrics updates (every 10s)');
    
    // Atualizar imediatamente
    this.updateMetrics().catch(console.error);
    
    // Atualizar a cada 10 segundos
    this.intervalId = setInterval(() => {
      this.updateMetrics().catch(console.error);
    }, 10000);
  }

  /**
   * Para atualização automática
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[MetricsUpdater] Stopped');
    }
  }

  /**
   * Atualiza todas as métricas de hardware
   */
  private async updateMetrics() {
    try {
      const hardware = await hardwareMetricsService.getMetrics();
      
      // CPU Metrics
      metrics.cpuUsageGauge.set(hardware.cpu.usage);
      metrics.cpuCoresGauge.set(hardware.cpu.cores);
      if (hardware.cpu.temperature !== undefined) {
        metrics.cpuTemperatureGauge.set(hardware.cpu.temperature);
      }
      
      // Memory Metrics
      metrics.memoryUsageGauge.set(hardware.memory.usagePercent);
      metrics.memoryTotalGauge.set(hardware.memory.total);
      metrics.memoryUsedGauge.set(hardware.memory.used);
      
      if (hardware.memory.swap && hardware.memory.swap.total > 0) {
        metrics.swapUsageGauge.set(hardware.memory.swap.usagePercent);
      }
      
      // Disk Metrics
      metrics.diskUsageGauge.set(hardware.disk.usagePercent);
      metrics.diskTotalGauge.set(hardware.disk.total);
      metrics.diskUsedGauge.set(hardware.disk.used);
      
      if (hardware.disk.readSpeed !== undefined) {
        metrics.diskReadSpeedGauge.set(hardware.disk.readSpeed);
      }
      if (hardware.disk.writeSpeed !== undefined) {
        metrics.diskWriteSpeedGauge.set(hardware.disk.writeSpeed);
      }
      
      // System Metrics
      metrics.systemUptimeGauge.set(hardware.system.uptime);
      
    } catch (error) {
      console.error('[MetricsUpdater] Error updating metrics:', error);
    }
  }
}

export const metricsUpdaterService = new MetricsUpdaterService();
