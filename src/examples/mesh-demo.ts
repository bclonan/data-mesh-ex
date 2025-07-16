import { MeshNetwork } from '../core/mesh-network';
import type { Message } from '../types/mesh';

export class MeshDemo {
  private network: MeshNetwork;
  private messageLog: Message[] = [];

  constructor() {
    this.network = new MeshNetwork();
  }

  async runDemo(): Promise<void> {
    console.log('🌐 Starting Data Mesh Demo...\n');

    // Create a network of 4 nodes
    const nodes = [
      this.network.createNode({ nodeId: 'sensor-001', seed: 7, phaseResetInterval: 100 }),
      this.network.createNode({ nodeId: 'sensor-002', seed: 7, phaseResetInterval: 100 }),
      this.network.createNode({ nodeId: 'gateway-001', seed: 7, phaseResetInterval: 100 }),
      this.network.createNode({ nodeId: 'observer-001', seed: 7, phaseResetInterval: 100 })
    ];

    // Set up message logging
    nodes.forEach(node => {
      node.onMessage((message: Message) => {
        this.messageLog.push(message);
        console.log(`📨 ${node.nodeId} received: ${JSON.stringify(message.data)} (step: ${message.globalStep}, pattern: ${message.patternValue})`);
      });

      node.onError((error) => {
        console.error(`❌ ${node.nodeId} error:`, error);
      });

      node.onSync((step) => {
        console.log(`🔄 ${node.nodeId} synchronized to step ${step}`);
      });
    });

    // Simulate sensor data broadcasts
    console.log('📡 Simulating sensor data broadcasts...\n');
    
    await this.delay(500);
    nodes[0].broadcast({ type: 'temperature', value: 23.5, unit: 'celsius' });
    
    await this.delay(500);
    nodes[1].broadcast({ type: 'humidity', value: 65, unit: 'percent' });
    
    await this.delay(500);
    nodes[2].broadcast({ type: 'status', value: 'online', uptime: 3600 });
    
    await this.delay(500);
    nodes[3].broadcast({ type: 'observation', value: 'normal_operation', confidence: 0.95 });

    console.log('\n📊 Demo completed! Message log:');
    this.printMessageSummary();
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private printMessageSummary(): void {
    console.log(`\n📈 Total messages: ${this.messageLog.length}`);
    
    const senders = [...new Set(this.messageLog.map(m => m.senderId))];
    console.log(`👥 Active senders: ${senders.join(', ')}`);
    
    const steps = [...new Set(this.messageLog.map(m => m.globalStep))];
    console.log(`🔢 Global steps: ${Math.min(...steps)} - ${Math.max(...steps)}`);
    
    const patterns = [...new Set(this.messageLog.map(m => m.patternValue))];
    console.log(`🎯 Pattern values: ${patterns.join(', ')}`);
  }
}