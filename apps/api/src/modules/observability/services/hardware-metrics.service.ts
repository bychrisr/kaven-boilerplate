import os from 'os';
import si from 'systeminformation';

export interface HardwareMetrics {
  cpu: {
    usage: number;
    cores: number;
    model: string;
    speed: number;
    loadAverage: number[];
    temperature?: number; // ⭐ Novo
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
    swap?: { // ⭐ Novo
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
    readSpeed?: number; // ⭐ Novo (bytes/sec)
    writeSpeed?: number; // ⭐ Novo (bytes/sec)
  };
  network: {
    interfaces: Array<{
      name: string;
      bytesReceived: number;
      bytesSent: number;
    }>;
  };
  system: {
    uptime: number;
    platform: string;
    arch: string;
    hostname: string;
  };
  timestamp: number;
}

export class HardwareMetricsService {
  async getMetrics(): Promise<HardwareMetrics> {
    const [cpu, memory, disk, network] = await Promise.all([
      this.getCPUMetrics(),
      this.getMemoryMetrics(),
      this.getDiskMetrics(),
      this.getNetworkMetrics()
    ]);

    return {
      cpu,
      memory,
      disk,
      network,
      system: this.getSystemInfo(),
      timestamp: Date.now()
    };
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
    
    const mainDisk = disks[0] || { size: 0, used: 0, available: 0, use: 0 };
    
    // ⭐ Adicionar I/O speed
    return {
      total: mainDisk.size,
      used: mainDisk.used,
      free: mainDisk.available,
      usagePercent: Math.round(mainDisk.use),
      readSpeed: diskIO.rIO_sec || 0,  // bytes/sec
      writeSpeed: diskIO.wIO_sec || 0  // bytes/sec
    };
  }

  private async getNetworkMetrics() {
    const networkStats = await si.networkStats();
    
    return {
      interfaces: networkStats.map(net => ({
        name: net.iface,
        bytesReceived: net.rx_bytes,
        bytesSent: net.tx_bytes
      }))
    };
  }

  private getSystemInfo() {
    return {
      uptime: os.uptime(),
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname()
    };
  }
}

export const hardwareMetricsService = new HardwareMetricsService();
