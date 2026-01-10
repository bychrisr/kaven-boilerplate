import { rateLimitRequestsTotal, rateLimitViolationsTotal, rateLimitViolationRate } from './metrics';

export class RateLimitMonitor {
  private violations = 0;
  private requests = 0;
  private violationsByIP: Map<string, number> = new Map();
  private requestsByIP: Map<string, number> = new Map();

  constructor() {
    console.log('[RateLimitMonitor] 🔧 Inicializado');
  }

  recordRequest(ip?: string) {
    this.requests++;
    rateLimitRequestsTotal.inc();

    if (ip) {
      const count = this.requestsByIP.get(ip) || 0;
      this.requestsByIP.set(ip, count + 1);
    }

    if (this.requests % 100 === 0) {
      console.log(`[RateLimitMonitor] 📊 Total de requisições: ${this.requests} (violações: ${this.violations})`);
    }
  }

  recordViolation(ip?: string, endpoint?: string) {
    this.violations++;
    rateLimitViolationsTotal.inc({ ip: ip || 'unknown' });

    if (ip) {
      const count = this.violationsByIP.get(ip) || 0;
      this.violationsByIP.set(ip, count + 1);
    }

    const violationRate = this.getViolationRate();
    rateLimitViolationRate.set(violationRate);
    console.log(`[RateLimitMonitor] ⚠️  Rate limit violation: ip=${ip || 'unknown'} endpoint=${endpoint || 'unknown'} (violationRate: ${violationRate.toFixed(2)}%)`);
  }

  getMetrics() {
    const violationRate = this.getViolationRate();
    const topViolators = this.getTopViolators(5);

    console.log('[RateLimitMonitor] 📊 Métricas:', {
      totalRequests: this.requests,
      violations: this.violations,
      violationRate: `${violationRate.toFixed(2)}%`,
      topViolators: topViolators.length
    });

    return {
      totalRequests: this.requests,
      violations: this.violations,
      violationRate,
      topViolators,
      uniqueIPs: this.requestsByIP.size
    };
  }

  private getViolationRate(): number {
    return this.requests > 0 
      ? (this.violations / this.requests) * 100 
      : 0;
  }

  private getTopViolators(limit: number = 10): Array<{ ip: string; violations: number; requests: number }> {
    const violators = Array.from(this.violationsByIP.entries())
      .map(([ip, violations]) => ({
        ip,
        violations,
        requests: this.requestsByIP.get(ip) || 0
      }))
      .sort((a, b) => b.violations - a.violations)
      .slice(0, limit);

    return violators;
  }

  resetMetrics() {
    console.log('[RateLimitMonitor] 🔄 Resetando métricas');
    this.violations = 0;
    this.requests = 0;
    this.violationsByIP.clear();
    this.requestsByIP.clear();
  }
}

// Singleton instance
let rateLimitMonitorInstance: RateLimitMonitor | null = null;

export function initRateLimitMonitor(): RateLimitMonitor {
  rateLimitMonitorInstance = new RateLimitMonitor();
  return rateLimitMonitorInstance;
}

export function getRateLimitMonitor(): RateLimitMonitor | null {
  return rateLimitMonitorInstance;
}
