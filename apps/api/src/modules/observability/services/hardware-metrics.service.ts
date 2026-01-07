import os from 'os';
import si from 'systeminformation';

export interface HardwareAlert {
  type: 'cpu' | 'memory' | 'disk';
  severity: 'warning' | 'critical';
  message: string;
  value: number;
  threshold: number;
  timestamp: number;
}

export interface HardwareMetrics {
  cpu: {
    usage: number;
    cores: number;
    model: string;
    speed: number;
    loadAverage: number[];
    temperature?: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
    swap: {
      total: number;
      used: number;
      free: number;
      usagePercent: number;
    };
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
    readSpeed: number;
    writeSpeed: number;
    filesystem?: string;
    mount?: string;
  };
  network: {
    interfaces: Array<{
      name: string;
      ip4?: string;
      mac?: string;
      bytesReceived: number;
      bytesSent: number;
      packetsReceived?: number;
      packetsSent?: number;
      speed?: number;
    }>;
  };
  system: {
    uptime: number;
    platform: string;
    arch: string;
    hostname: string;
    osVersion?: string;
    kernel?: string;
    timezone?: string;
  };
  alerts: HardwareAlert[];
  timestamp: number;
}

export class HardwareMetricsService {
  async getMetrics(): Promise<HardwareMetrics> {
    const [cpu, memory, disk, network, system] = await Promise.all([
      this.getCPUMetrics(),
      this.getMemoryMetrics(),
      this.getDiskMetrics(),
      this.getNetworkMetrics(),
      this.getSystemMetrics()
    ]);

    const metrics = {
      cpu,
      memory,
      disk,
      network,
      system,
      alerts: [] as HardwareAlert[],
      timestamp: Date.now()
    };

    // Generate alerts based on metrics
    metrics.alerts = this.generateAlerts(metrics);

    return metrics;
  }

  private async getCPUMetrics() {
    const cpus = os.cpus();
    const cpuLoad = await si.currentLoad();
    
    // ⭐ Tentar obter temperatura (pode não estar disponível em todos os sistemas)
    let temperature: number | undefined;
    try {
      const cpuTemp = await si.cpuTemperature();
      temperature = cpuTemp.main || cpuTemp.max || undefined;
    } catch (error) {
      // Temperatura não disponível neste sistema
      temperature = undefined;
    }
    
    return {
      usage: Math.round(cpuLoad.currentLoad),
      cores: cpus.length,
      model: cpus[0].model,
      speed: cpus[0].speed,
      loadAverage: os.loadavg(),
      temperature
    };
  }

  private async getMemoryMetrics() {
    const mem = await si.mem();
    
    // ⭐ Adicionar swap memory
    const swap = {
      total: mem.swaptotal,
      used: mem.swapused,
      free: mem.swapfree,
      usagePercent: mem.swaptotal > 0 
        ? Math.round((mem.swapused / mem.swaptotal) * 100) 
        : 0
    };
    
    return {
      total: mem.total,
      used: mem.used,
      free: mem.free,
      usagePercent: Math.round((mem.used / mem.total) * 100),
      swap
    };
  }

  private async getDiskMetrics() {
    const [disks, diskIO] = await Promise.all([
      si.fsSize(),
      si.disksIO()
    ]);
    
    const mainDisk = disks[0] || { size: 0, used: 0, available: 0, use: 0, fs: '', mount: '' };
    
    return {
      total: mainDisk.size,
      used: mainDisk.used,
      free: mainDisk.available,
      usagePercent: Math.round(mainDisk.use),
      readSpeed: diskIO.rIO_sec || 0,
      writeSpeed: diskIO.wIO_sec || 0,
      filesystem: mainDisk.fs,
      mount: mainDisk.mount
    };
  }

  private async getNetworkMetrics() {
    const [networkStats, networkInterfaces] = await Promise.all([
      si.networkStats(),
      si.networkInterfaces()
    ]);
    
    return {
      interfaces: networkStats.map((net, index) => ({
        name: net.iface,
        ip4: networkInterfaces[index]?.ip4 || undefined,
        mac: networkInterfaces[index]?.mac || undefined,
        bytesReceived: net.rx_bytes,
        bytesSent: net.tx_bytes,
        packetsReceived: net.rx_sec || undefined,
        packetsSent: net.tx_sec || undefined,
        speed: networkInterfaces[index]?.speed || undefined
      }))
    };
  }

  private async getSystemMetrics() {
    const [osInfo, time] = await Promise.all([
      si.osInfo(),
      si.time()
    ]);
    
    return {
      uptime: os.uptime(),
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      osVersion: osInfo.distro,
      kernel: osInfo.kernel,
      timezone: time.timezone
    };
  }

  private generateAlerts(metrics: Omit<HardwareMetrics, 'alerts'>): HardwareAlert[] {
    const alerts: HardwareAlert[] = [];
    const timestamp = Date.now();

    // CPU alerts
    if (metrics.cpu.usage > 90) {
      alerts.push({
        type: 'cpu',
        severity: 'critical',
        message: 'CPU usage is critically high',
        value: metrics.cpu.usage,
        threshold: 90,
        timestamp
      });
    } else if (metrics.cpu.usage > 80) {
      alerts.push({
        type: 'cpu',
        severity: 'warning',
        message: 'CPU usage is high',
        value: metrics.cpu.usage,
        threshold: 80,
        timestamp
      });
    }

    // Memory alerts
    if (metrics.memory.usagePercent > 95) {
      alerts.push({
        type: 'memory',
        severity: 'critical',
        message: 'Memory usage is critically high',
        value: metrics.memory.usagePercent,
        threshold: 95,
        timestamp
      });
    } else if (metrics.memory.usagePercent > 85) {
      alerts.push({
        type: 'memory',
        severity: 'warning',
        message: 'Memory usage is high',
        value: metrics.memory.usagePercent,
        threshold: 85,
        timestamp
      });
    }

    // Disk alerts
    if (metrics.disk.usagePercent > 90) {
      alerts.push({
        type: 'disk',
        severity: 'critical',
        message: 'Disk usage is critically high',
        value: metrics.disk.usagePercent,
        threshold: 90,
        timestamp
      });
    } else if (metrics.disk.usagePercent > 80) {
      alerts.push({
        type: 'disk',
        severity: 'warning',
        message: 'Disk usage is high',
        value: metrics.disk.usagePercent,
        threshold: 80,
        timestamp
      });
    }

    return alerts;
  }
}

export const hardwareMetricsService = new HardwareMetricsService();
