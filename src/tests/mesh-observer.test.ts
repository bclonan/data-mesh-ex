import { expect, test, describe, vi } from 'vitest';
import { MeshObserver } from '../core/mesh-observer';

describe('MeshObserver', () => {
  test('should validate correct pattern values', () => {
    const observer = new MeshObserver({ seed: 7, phaseResetInterval: 100 });
    
    const validMessageSpy = vi.fn();
    observer.onValidMessage(validMessageSpy);

    observer.observe({
      senderId: 'test-node',
      globalStep: 0,
      patternValue: 7,
      data: { test: 'data' }
    });

    expect(validMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        senderId: 'test-node',
        globalStep: 0,
        patternValue: 7
      })
    );
  });

  test('should detect pattern anomalies', () => {
    const observer = new MeshObserver({ seed: 7, phaseResetInterval: 100 });
    
    const anomalySpy = vi.fn();
    observer.onAnomaly(anomalySpy);

    observer.observe({
      senderId: 'malicious-node',
      globalStep: 0,
      patternValue: 9, // Wrong pattern value
      data: { test: 'data' }
    });

    expect(anomalySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'pattern-mismatch',
        expected: 7,
        received: 9
      })
    );
  });

  test('should provide accurate statistics', () => {
    const observer = new MeshObserver({ seed: 7, phaseResetInterval: 100 });
    
    // Add valid message
    observer.observe({
      senderId: 'node1',
      globalStep: 0,
      patternValue: 7,
      data: {}
    });

    // Add invalid message
    observer.observe({
      senderId: 'node2',
      globalStep: 1,
      patternValue: 9,
      data: {}
    });

    const stats = observer.getStatistics();
    
    expect(stats.totalObserved).toBe(2);
    expect(stats.validMessages).toBe(1);
    expect(stats.anomalies).toBe(1);
    expect(stats.successRate).toBe(50);
  });
});