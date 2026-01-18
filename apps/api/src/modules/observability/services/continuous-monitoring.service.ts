import { hardwareMetricsService } from './hardware-metrics.service';
import { infrastructureMonitorService } from './infrastructure-monitor.service';
import { externalAPIMonitorService } from './external-api-monitor.service';
import { advancedMetricsService } from './advanced-metrics.service';

interface MonitoringSession {
  id: string;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  intervalSeconds: number;
  status: 'active' | 'completed' | 'stopped';
  snapshots: MonitoringSnapshot[];
}

interface MonitoringSnapshot {
  timestamp: number;
  hardware: any;
  infrastructure: any;
  externalAPIs: any;
  advanced: any;
}

export class ContinuousMonitoringService {
  private sessions = new Map<string, MonitoringSession>();
  private intervals = new Map<string, NodeJS.Timeout>();

  constructor() {
    console.log('[ContinuousMonitoring] 🔧 Inicializado');
  }

  async startMonitoring(durationMinutes: number, intervalSeconds: number = 10): Promise<MonitoringSession> {
    const sessionId = this.generateSessionId();
    const startTime = Date.now();
    const endTime = startTime + (durationMinutes * 60 * 1000);

    const session: MonitoringSession = {
      id: sessionId,
      startTime,
      endTime,
      durationMinutes,
      intervalSeconds,
      status: 'active',
      snapshots: []
    };

    this.sessions.set(sessionId, session);

    console.log(`[ContinuousMonitoring] 🔄 Iniciando sessão de monitoramento: id=${sessionId} duration=${durationMinutes}min interval=${intervalSeconds}s`);

    // Coletar primeira snapshot imediatamente
    await this.collectSnapshot(sessionId);

    // Configurar coleta periódica
    const interval = setInterval(async () => {
      const currentSession = this.sessions.get(sessionId);
      if (!currentSession || currentSession.status !== 'active') {
        clearInterval(interval);
        this.intervals.delete(sessionId);
        return;
      }

      if (Date.now() >= currentSession.endTime) {
        await this.stopMonitoring(sessionId);
        return;
      }

      await this.collectSnapshot(sessionId);
    }, intervalSeconds * 1000);

    this.intervals.set(sessionId, interval);

    return session;
  }

  async stopMonitoring(sessionId: string): Promise<MonitoringSession | null> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.log(`[ContinuousMonitoring] ⚠️  Sessão não encontrada: id=${sessionId}`);
      return null;
    }

    const interval = this.intervals.get(sessionId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(sessionId);
    }

    session.status = session.status === 'active' ? 'stopped' : session.status;
    
    console.log(`[ContinuousMonitoring] ✅ Sessão finalizada: id=${sessionId} snapshots=${session.snapshots.length} status=${session.status}`);

    return session;
  }

  private async collectSnapshot(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    try {
      const start = Date.now();
      
      const [hardware, infrastructure, externalAPIs, advanced] = await Promise.all([
        hardwareMetricsService.getMetrics(),
        infrastructureMonitorService.checkAll(),
        externalAPIMonitorService.checkAll(),
        advancedMetricsService.getAdvancedMetrics()
      ]);

      const snapshot: MonitoringSnapshot = {
        timestamp: Date.now(),
        hardware,
        infrastructure,
        externalAPIs,
        advanced
      };

      session.snapshots.push(snapshot);

      const collectionTime = Date.now() - start;
      const iteration = session.snapshots.length;
      const totalIterations = Math.ceil((session.durationMinutes * 60) / session.intervalSeconds);

      console.log(`[ContinuousMonitoring] 📊 Snapshot coletado: session=${sessionId} iteration=${iteration}/${totalIterations} (${collectionTime}ms)`);

      // Marcar como completed se atingiu o tempo final
      if (Date.now() >= session.endTime) {
        session.status = 'completed';
        console.log(`[ContinuousMonitoring] ✅ Monitoramento completo: session=${sessionId} total_snapshots=${session.snapshots.length}`);
      }
    } catch (error: any) {
      console.error(`[ContinuousMonitoring] 🔥 Erro ao coletar snapshot: session=${sessionId}`, error.message);
    }
  }

  getSession(sessionId: string): MonitoringSession | null {
    return this.sessions.get(sessionId) || null;
  }

  getActiveSessions(): MonitoringSession[] {
    return Array.from(this.sessions.values()).filter(s => s.status === 'active');
  }

  getAllSessions(): MonitoringSession[] {
    return Array.from(this.sessions.values());
  }

  private generateSessionId(): string {
    return `mon_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

export const continuousMonitoringService = new ContinuousMonitoringService();
