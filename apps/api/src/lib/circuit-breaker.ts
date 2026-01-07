import { circuitBreakerState, circuitBreakerFailures } from './metrics';

export interface CircuitBreakerOptions {
  threshold?: number;
  timeout?: number;
  resetTimeout?: number;
}

export class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime?: number;
  private readonly threshold: number;
  private readonly timeout: number;
  private readonly resetTimeout: number;
  private readonly serviceName: string;

  constructor(serviceName: string, options: CircuitBreakerOptions = {}) {
    this.serviceName = serviceName;
    this.threshold = options.threshold || 5;
    this.timeout = options.timeout || 5000;
    this.resetTimeout = options.resetTimeout || 30000;
    
    // Initialize metrics
    circuitBreakerState.set({ service: serviceName }, 0); // 0 = CLOSED
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - (this.lastFailureTime || 0) > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        circuitBreakerState.set({ service: this.serviceName }, 2);
      } else {
        throw new Error(`Circuit breaker is OPEN for ${this.serviceName}`);
      }
    }

    try {
      const result = await Promise.race([
        fn(),
        this.timeoutPromise()
      ]);

      this.onSuccess();
      return result as T;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      circuitBreakerState.set({ service: this.serviceName }, 0);
    }
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    circuitBreakerFailures.inc({ service: this.serviceName });
    
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      circuitBreakerState.set({ service: this.serviceName }, 1);
    }
  }

  private timeoutPromise(): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${this.timeout}ms`)), this.timeout)
    );
  }

  getState() {
    return this.state;
  }

  getFailureCount() {
    return this.failureCount;
  }
}

// Create circuit breakers for external services
export const stripeCircuitBreaker = new CircuitBreaker('stripe', {
  threshold: 5,
  timeout: 5000,
  resetTimeout: 30000
});

export const googleMapsCircuitBreaker = new CircuitBreaker('google_maps', {
  threshold: 5,
  timeout: 5000,
  resetTimeout: 30000
});

export const pagbitCircuitBreaker = new CircuitBreaker('pagbit', {
  threshold: 5,
  timeout: 5000,
  resetTimeout: 30000
});
