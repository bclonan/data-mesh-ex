import { expect, test, describe, vi } from 'vitest';
import { MeshNode } from '../core/mesh-node';

describe('MeshNode', () => {
  test('should broadcast messages with correct pattern values', () => {
    const node = new MeshNode({
      nodeId: 'test-node',
      seed: 7,
      phaseResetInterval: 100
    });

    const broadcastSpy = vi.fn();
    node.onBroadcast(broadcastSpy);

    node.broadcast({ test: 'data' });

    expect(broadcastSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        senderId: 'test-node',
        globalStep: 0,
        patternValue: 7,
        data: { test: 'data' }
      })
    );
  });

  test('should detect pattern mismatches', () => {
    const node = new MeshNode({
      nodeId: 'test-node',
      seed: 7,
      phaseResetInterval: 100
    });

    const errorSpy = vi.fn();
    node.onError(errorSpy);

    node.receive({
      senderId: 'other-node',
      globalStep: 0,
      patternValue: 9, // Wrong pattern value
      data: { test: 'data' }
    });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'pattern-mismatch'
      })
    );
  });
});