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
    console.log('[HardwareMetricsService] 🔍 Iniciando coleta de métricas de hardware...');
    const startTime = Date.now();

    const [cpu, memory, disk, network, system] = await Promise.all([
      this.getCPUMetrics(),
      this.getMemoryMetrics(),
      this.getDiskMetrics(),
      this.getNetworkMetrics(),
      this.getSystemMetrics()
    ]);

    console.log('[HardwareMetricsService] ✅ Métricas coletadas com sucesso:', {
      cpu: `${cpu.usage}% (${cpu.cores} cores)`,
      memory: `${memory.usagePercent}% (${(memory.used / 1024 / 1024 / 1024).toFixed(2)}GB/${(memory.total / 1024 / 1024 / 1024).toFixed(2)}GB)`,
      disk: `${disk.usagePercent}% (${(disk.used / 1024 / 1024 / 1024).toFixed(2)}GB/${(disk.total / 1024 / 1024 / 1024).toFixed(2)}GB)`,
      network: `${network.interfaces.length} interfaces`,
      system: `${system.platform} ${system.arch}`,
      collectionTime: `${Date.now() - startTime}ms`
    });

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
    
    if (metrics.alerts.length > 0) {
      console.log(`[HardwareMetricsService] ⚠️  ${metrics.alerts.length} alertas gerados:`, 
        metrics.alerts.map(a => `${a.type}:${a.severity} (${a.value}% > ${a.threshold}%)`));
    } else {
      console.log('[HardwareMetricsService] ✅ Nenhum alerta gerado - sistema saudável');
    }

    return metrics;
  }

  private async getCPUMetrics() {
    console.log('[HardwareMetricsService] 📊 Coletando métricas de CPU...');
    const cpus = os.cpus();
    const cpuLoad = await si.currentLoad();
    
    // ⭐ Tentar obter temperatura (pode não estar disponível em todos os sistemas)
    let temperature: number | undefined;
    try {
      const cpuTemp = await si.cpuTemperature();
      temperature = cpuTemp.main || cpuTemp.max || undefined;
      if (temperature !== undefined) {
        console.log(`[HardwareMetricsService] 🌡️  Temperatura CPU: ${temperature}°C`);
      } else {
        console.log('[HardwareMetricsService] ℹ️  Temperatura CPU não disponível (sensor retornou undefined)');
      }
    } catch (error) {
      console.log('[HardwareMetricsService] ⚠️  Temperatura CPU não disponível neste sistema');
      temperature = undefined;
    }
    
    const metrics = {
      usage: Math.round(cpuLoad.currentLoad),
      cores: cpus.length,
      model: cpus[0].model,
      speed: cpus[0].speed,
      loadAverage: os.loadavg(),
      temperature
    };

    console.log('[HardwareMetricsService] ✅ CPU:', {
      usage: `${metrics.usage}%`,
      cores: metrics.cores,
      model: metrics.model.substring(0, 30) + '...',
      loadAvg: metrics.loadAverage.map(l => l.toFixed(2)).join(', ')
    });

    return metrics;
  }

  private async getMemoryMetrics() {
    console.log('[HardwareMetricsService] 💾 Coletando métricas de memória...');
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
    
    const metrics = {
      total: mem.total,
      used: mem.used,
      free: mem.free,
      usagePercent: Math.round((mem.used / mem.total) * 100),
      swap
    };

    console.log('[HardwareMetricsService] ✅ Memória:', {
      usage: `${metrics.usagePercent}%`,
      used: `${(metrics.used / 1024 / 1024 / 1024).toFixed(2)}GB`,
      total: `${(metrics.total / 1024 / 1024 / 1024).toFixed(2)}GB`,
      swap: swap.total > 0 ? `${swap.usagePercent}% (${(swap.used / 1024 / 1024 / 1024).toFixed(2)}GB)` : 'N/A'
    });

    return metrics;
  }

  private async getDiskMetrics() {
    console.log('[HardwareMetricsService] 💿 Coletando métricas de disco...');
    const [disks, diskIO] = await Promise.all([
      si.fsSize(),
      si.disksIO()
    ]);
    
    const mainDisk = disks[0] || { size: 0, used: 0, available: 0, use: 0, fs: '', mount: '' };
    
    const metrics = {
      total: mainDisk.size,
      used: mainDisk.used,
      free: mainDisk.available,
      usagePercent: Math.round(mainDisk.use),
      readSpeed: diskIO.rIO_sec || 0,
      writeSpeed: diskIO.wIO_sec || 0,
      filesystem: mainDisk.fs,
      mount: mainDisk.mount
    };

    console.log('[HardwareMetricsService] ✅ Disco:', {
      usage: `${metrics.usagePercent}%`,
      used: `${(metrics.used / 1024 / 1024 / 1024).toFixed(2)}GB`,
      total: `${(metrics.total / 1024 / 1024 / 1024).toFixed(2)}GB`,
      mount: metrics.mount,
      io: `R:${metrics.readSpeed}/s W:${metrics.writeSpeed}/s`
    });

    return metrics;
  }

  private async getNetworkMetrics() {
    console.log('[HardwareMetricsService] 🌐 Coletando métricas de rede...');
    const [networkStats, networkInterfaces] = await Promise.all([
      si.networkStats(),
      si.networkInterfaces()
    ]);
    
    const metrics = {
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

    console.log('[HardwareMetricsService] ✅ Rede:', {
      interfaces: metrics.interfaces.length,
      details: metrics.interfaces.map(i => `${i.name} (${i.ip4 || 'no-ip'})`).join(', ')
    });

    return metrics;
  }

  private async getSystemMetrics() {
    console.log('[HardwareMetricsService] 🖥️  Coletando métricas de sistema...');
    const [osInfo, time] = await Promise.all([
      si.osInfo(),
      si.time()
    ]);
    
    const metrics = {
      uptime: os.uptime(),
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      osVersion: osInfo.distro,
      kernel: osInfo.kernel,
      timezone: time.timezone
    };

    const uptimeHours = (metrics.uptime / 3600).toFixed(1);
    console.log('[HardwareMetricsService] ✅ Sistema:', {
      hostname: metrics.hostname,
      os: `${metrics.osVersion} (${metrics.platform})`,
      uptime: `${uptimeHours}h`,
      timezone: metrics.timezone
    });

    return metrics;
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
