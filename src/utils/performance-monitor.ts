export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private timers: Map<string, number> = new Map();

  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  endTimer(name: string): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      throw new Error(`Timer '${name}' was not started`);
    }

    const duration = performance.now() - startTime;
    this.timers.delete(name);
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name)!.push(duration);
    return duration;
  }

  getMetrics(name: string): {
    count: number;
    avg: number;
    min: number;
    max: number;
    total: number;
  } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) {
      return null;
    }

    const total = values.reduce((sum, val) => sum + val, 0);
    const avg = total / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      count: values.length,
      avg,
      min,
      max,
      total
    };
  }

  getAllMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [name] of this.metrics) {
      result[name] = this.getMetrics(name);
    }
    
    return result;
  }

  reset(): void {
    this.metrics.clear();
    this.timers.clear();
  }
}