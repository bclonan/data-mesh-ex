export interface PerformanceMetrics {
  messagesPerSecond: number;
  averageLatency: number;
  memoryUsage: number;
  cpuUsage: number;
  nodeCount: number;
  uptime: number;
}

export class PerformanceMonitor {
  private startTime: number;
  private messageCount: number = 0;
  private latencySum: number = 0;
  private latencyCount: number = 0;

  constructor() {
    this.startTime = Date.now();
  }

  recordMessage(): void {
    this.messageCount++;
  }

  recordLatency(latency: number): void {
    this.latencySum += latency;
    this.latencyCount++;
  }

  getMetrics(): PerformanceMetrics {
    const uptime = (Date.now() - this.startTime) / 1000;
    const messagesPerSecond = uptime > 0 ? this.messageCount / uptime : 0;
    const averageLatency = this.latencyCount > 0 ? this.latencySum / this.latencyCount : 0;

    return {
      messagesPerSecond: Math.round(messagesPerSecond * 100) / 100,
      averageLatency: Math.round(averageLatency * 100) / 100,
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: 0, // Placeholder - would need more complex implementation
      nodeCount: 0, // To be set externally
      uptime: Math.round(uptime)
    };
  }

  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      return Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024 * 100) / 100;
    }
    return 0;
  }

  reset(): void {
    this.startTime = Date.now();
    this.messageCount = 0;
    this.latencySum = 0;
    this.latencyCount = 0;
  }
}
