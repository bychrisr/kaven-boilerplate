import { Redis } from 'ioredis';
import { cacheHitsTotal, cacheMissesTotal, cacheHitRate } from './metrics';

interface CacheConfig {
  ttl: number;
  maxSize: number;
  strategy: 'LRU' | 'LFU' | 'FIFO';
  enabled: boolean;
}

export class CacheProtection {
  private redis: Redis;
  private config: CacheConfig;
  private hitCount = 0;
  private missCount = 0;

  constructor(redis: Redis, config: CacheConfig) {
    this.redis = redis;
    this.config = config;
    console.log('[CacheProtection] 🔧 Inicializado:', {
      ttl: `${config.ttl}s`,
      strategy: config.strategy,
      enabled: config.enabled
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.config.enabled) {
      this.missCount++;
      console.log(`[CacheProtection] ⚙️  Cache desabilitado: key=${key}`);
      return null;
    }

    try {
      const start = Date.now();
      const value = await this.redis.get(key);
      const latency = Date.now() - start;

      if (value) {
        this.hitCount++;
        cacheHitsTotal.inc();
        cacheHitRate.set(this.getHitRate());
        console.log(`[CacheProtection] ✅ Cache HIT: key=${key} (${latency}ms, hitRate: ${this.getHitRate().toFixed(1)}%)`);
        return JSON.parse(value);
      }

      this.missCount++;
      cacheMissesTotal.inc();
      cacheHitRate.set(this.getHitRate());
      console.log(`[CacheProtection] ❌ Cache MISS: key=${key} (${latency}ms, missRate: ${this.getMissRate().toFixed(1)}%)`);
      return null;
    } catch (error: any) {
      this.missCount++;
      cacheMissesTotal.inc();
      cacheHitRate.set(this.getHitRate());
      console.error(`[CacheProtection] 🔥 Erro ao buscar cache: key=${key}`, error.message);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (!this.config.enabled) {
      console.log(`[CacheProtection] ⚙️  Cache desabilitado: não salvando key=${key}`);
      return;
    }

    try {
      const start = Date.now();
      const serialized = JSON.stringify(value);
      const cacheTTL = ttl || this.config.ttl;
      await this.redis.setex(key, cacheTTL, serialized);
      const latency = Date.now() - start;

      console.log(`[CacheProtection] 💾 Cache SET: key=${key} (${latency}ms, ttl=${cacheTTL}s, size=${serialized.length}bytes)`);
    } catch (error: any) {
      console.error(`[CacheProtection] 🔥 Erro ao salvar cache: key=${key}`, error.message);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.config.enabled) return;

    try {
      const start = Date.now();
      await this.redis.del(key);
      const latency = Date.now() - start;
      console.log(`[CacheProtection] 🗑️  Cache DELETE: key=${key} (${latency}ms)`);
    } catch (error: any) {
      console.error(`[CacheProtection] 🔥 Erro ao deletar cache: key=${key}`, error.message);
    }
  }

  getMetrics() {
    const total = this.hitCount + this.missCount;
    const hitRate = this.getHitRate();
    const missRate = this.getMissRate();

    console.log('[CacheProtection] 📊 Métricas:', {
      hitCount: this.hitCount,
      missCount: this.missCount,
      total,
      hitRate: `${hitRate.toFixed(2)}%`,
      missRate: `${missRate.toFixed(2)}%`
    });

    return {
      hitCount: this.hitCount,
      missCount: this.missCount,
      total,
      hitRate,
      missRate,
      enabled: this.config.enabled,
      ttl: this.config.ttl,
      strategy: this.config.strategy
    };
  }

  private getHitRate(): number {
    const total = this.hitCount + this.missCount;
    return total > 0 ? (this.hitCount / total) * 100 : 0;
  }

  private getMissRate(): number {
    const total = this.hitCount + this.missCount;
    return total > 0 ? (this.missCount / total) * 100 : 0;
  }

  resetMetrics() {
    console.log('[CacheProtection] 🔄 Resetando métricas');
    this.hitCount = 0;
    this.missCount = 0;
  }
}

// Singleton instance
let cacheProtectionInstance: CacheProtection | null = null;

export function initCacheProtection(redis: Redis, config?: Partial<CacheConfig>): CacheProtection {
  const defaultConfig: CacheConfig = {
    ttl: 3600, // 1 hora
    maxSize: 1000,
    strategy: 'LRU',
    enabled: true,
    ...config
  };

  cacheProtectionInstance = new CacheProtection(redis, defaultConfig);
  return cacheProtectionInstance;
}

export function getCacheProtection(): CacheProtection | null {
  return cacheProtectionInstance;
}
