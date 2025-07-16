import { expect, test, describe } from 'vitest';
import { PerformanceMonitor } from '../utils/performance-monitor';

describe('PerformanceMonitor', () => {
  test('should measure timer durations', async () => {
    const monitor = new PerformanceMonitor();
    
    monitor.startTimer('test-operation');
    await new Promise(resolve => setTimeout(resolve, 10));
    const duration = monitor.endTimer('test-operation');
    
    expect(duration).toBeGreaterThan(0);
    expect(duration).toBeLessThan(50); // Should be around 10ms
  });

  test('should provide accurate metrics', async () => {
    const monitor = new PerformanceMonitor();
    
    // Add multiple measurements
    for (let i = 0; i < 3; i++) {
      monitor.startTimer('batch-operation');
      await new Promise(resolve => setTimeout(resolve, 5));
      monitor.endTimer('batch-operation');
    }
    
    const metrics = monitor.getMetrics('batch-operation');
    
    expect(metrics).not.toBeNull();
    expect(metrics!.count).toBe(3);
    expect(metrics!.avg).toBeGreaterThan(0);
    expect(metrics!.min).toBeGreaterThan(0);
    expect(metrics!.max).toBeGreaterThan(0);
  });

  test('should handle non-existent timers', () => {
    const monitor = new PerformanceMonitor();
    
    expect(() => monitor.endTimer('non-existent')).toThrow();
  });
});