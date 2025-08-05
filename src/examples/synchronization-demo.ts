import { MeshNetwork } from '../core/mesh-network';
import type { Message } from '../types/mesh';

export class SynchronizationDemo {
  private network: MeshNetwork;

  constructor() {
    this.network = new MeshNetwork();
  }

  async runDemo(): Promise<void> {
    console.log('🔄 Starting Synchronization Demo...\n');

    // Create nodes with different initial states
    const nodeA = this.network.createNode({ 
      nodeId: 'node-a', 
      seed: 7, 
      phaseResetInterval: 100 
    });

    const nodeB = this.network.createNode({ 
      nodeId: 'node-b', 
      seed: 7, 
      phaseResetInterval: 100 
    });

    // Set up event listeners
    nodeA.onMessage((message: Message) => {
      console.log(`🔵 Node A received: ${JSON.stringify(message.data)} at step ${message.globalStep}`);
    });

    nodeB.onMessage((message: Message) => {
      console.log(`🔴 Node B received: ${JSON.stringify(message.data)} at step ${message.globalStep}`);
    });

    nodeA.onSync((step) => {
      console.log(`🔄 Node A synchronized to step ${step}`);
    });

    nodeB.onSync((step) => {
      console.log(`🔄 Node B synchronized to step ${step}`);
    });

    // Simulate messages from different steps
    console.log('📡 Node A broadcasting at step 0...');
    nodeA.broadcast({ message: 'Hello from A', timestamp: Date.now() });

    await this.delay(1000);

    console.log('📡 Node B broadcasting at step 1...');
    nodeB.broadcast({ message: 'Hello from B', timestamp: Date.now() });

    await this.delay(1000);

    console.log('📡 Node A broadcasting again (should be at step 2)...');
    nodeA.broadcast({ message: 'Second message from A', timestamp: Date.now() });

    console.log('\n✅ Synchronization demo completed!');
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => globalThis.setTimeout(resolve, ms));
  }
}