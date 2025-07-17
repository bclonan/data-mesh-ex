import { MeshNetwork } from '../core/mesh-network';
import type { Message } from '../types/mesh';

export class DistributedWebDemo {
  private network: MeshNetwork;
  private messageLog: Message[] = [];

  constructor() {
    this.network = new MeshNetwork();
  }

  async runCollaborativeEditingDemo(): Promise<void> {
    console.log('📝 Starting Collaborative Editing Demo...\n');

    // Create nodes representing different users/clients
    const users = [
      { id: 'user-alice', name: 'Alice', location: 'New York' },
      { id: 'user-bob', name: 'Bob', location: 'London' },
      { id: 'user-charlie', name: 'Charlie', location: 'Tokyo' },
      { id: 'user-diana', name: 'Diana', location: 'Sydney' }
    ];

    const nodes = users.map(user => {
      const node = this.network.createNode({
        nodeId: user.id,
        seed: 7,
        phaseResetInterval: 100
      });

      node.onMessage((message: Message) => {
        this.messageLog.push(message);
        console.log(`📝 ${user.name} (${user.location}) received edit: ${JSON.stringify(message.data)}`);
      });

      return { node, user };
    });

    // Simulate collaborative document editing
    const documentEdits = [
      { user: 0, action: 'insert', position: 0, content: 'Hello World!', timestamp: Date.now() },
      { user: 1, action: 'insert', position: 12, content: ' How are you?', timestamp: Date.now() + 100 },
      { user: 2, action: 'delete', position: 6, length: 5, timestamp: Date.now() + 200 },
      { user: 3, action: 'insert', position: 6, content: 'beautiful', timestamp: Date.now() + 300 },
      { user: 0, action: 'format', position: 0, length: 5, style: 'bold', timestamp: Date.now() + 400 }
    ];

    for (const edit of documentEdits) {
      await this.delay(800);
      const { node, user } = nodes[edit.user];
      
      console.log(`✏️  ${user.name} making edit: ${edit.action} at position ${edit.position}`);
      
      node.broadcast({
        type: 'document-edit',
        userId: user.id,
        userName: user.name,
        location: user.location,
        edit: edit,
        documentId: 'shared-doc-001',
        version: this.messageLog.length + 1
      });
    }

    console.log('\n📊 Collaborative editing session completed!');
    console.log(`💾 Total edits synchronized: ${this.messageLog.length}`);
  }

  async runDistributedGamingDemo(): Promise<void> {
    console.log('🎮 Starting Distributed Gaming Demo...\n');

    // Create game server nodes
    const gameServers = [
      { id: 'game-server-us', region: 'US-East', players: 0 },
      { id: 'game-server-eu', region: 'EU-West', players: 0 },
      { id: 'game-server-asia', region: 'Asia-Pacific', players: 0 }
    ];

    const serverNodes = gameServers.map(server => {
      const node = this.network.createNode({
        nodeId: server.id,
        seed: 7,
        phaseResetInterval: 100
      });

      node.onMessage((message: Message) => {
        if (message.data.type === 'player-action') {
          console.log(`🎮 ${server.region} processed: ${message.data.action} by ${message.data.playerId}`);
        }
      });

      return { node, server };
    });

    // Simulate player actions across different servers
    const playerActions = [
      { server: 0, playerId: 'player-001', action: 'move', position: { x: 100, y: 200 }, health: 100 },
      { server: 1, playerId: 'player-002', action: 'attack', target: 'player-001', damage: 25 },
      { server: 2, playerId: 'player-003', action: 'pickup', item: 'health-potion', quantity: 1 },
      { server: 0, playerId: 'player-001', action: 'defend', shield: true, duration: 3000 },
      { server: 1, playerId: 'player-004', action: 'cast-spell', spell: 'fireball', mana: 50 }
    ];

    for (const action of playerActions) {
      await this.delay(1000);
      const { node, server } = serverNodes[action.server];
      
      console.log(`⚡ ${server.region} broadcasting: ${action.action} by ${action.playerId}`);
      
      node.broadcast({
        type: 'player-action',
        serverId: server.id,
        region: server.region,
        playerId: action.playerId,
        action: action.action,
        data: action,
        timestamp: Date.now(),
        gameState: this.generateRandomGameState()
      });
    }

    console.log('\n🏆 Gaming session completed!');
  }

  async runMicroservicesDemo(): Promise<void> {
    console.log('🔧 Starting Microservices Communication Demo...\n');

    // Create microservice nodes
    const services = [
      { id: 'user-service', name: 'User Service', port: 3001 },
      { id: 'order-service', name: 'Order Service', port: 3002 },
      { id: 'payment-service', name: 'Payment Service', port: 3003 },
      { id: 'inventory-service', name: 'Inventory Service', port: 3004 },
      { id: 'notification-service', name: 'Notification Service', port: 3005 }
    ];

    const serviceNodes = services.map(service => {
      const node = this.network.createNode({
        nodeId: service.id,
        seed: 7,
        phaseResetInterval: 100
      });

      node.onMessage((message: Message) => {
        console.log(`🔧 ${service.name} received: ${message.data.operation} from ${message.senderId}`);
      });

      return { node, service };
    });

    // Simulate microservice interactions
    const serviceOperations = [
      { service: 0, operation: 'user-login', userId: 'user-12345', success: true },
      { service: 1, operation: 'create-order', orderId: 'order-67890', items: ['item-1', 'item-2'] },
      { service: 3, operation: 'check-inventory', items: ['item-1', 'item-2'], available: true },
      { service: 2, operation: 'process-payment', amount: 99.99, currency: 'USD', success: true },
      { service: 4, operation: 'send-notification', type: 'order-confirmed', recipient: 'user-12345' }
    ];

    for (const operation of serviceOperations) {
      await this.delay(1200);
      const { node, service } = serviceNodes[operation.service];
      
      console.log(`📡 ${service.name} broadcasting: ${operation.operation}`);
      
      node.broadcast({
        type: 'service-operation',
        serviceId: service.id,
        serviceName: service.name,
        operation: operation.operation,
        data: operation,
        timestamp: Date.now(),
        requestId: this.generateRequestId(),
        metrics: this.generateServiceMetrics()
      });
    }

    console.log('\n🎯 Microservices communication demo completed!');
  }

  async runIoTSmartCityDemo(): Promise<void> {
    console.log('🏙️ Starting IoT Smart City Demo...\n');

    // Create IoT sensor nodes
    const sensors = [
      { id: 'traffic-sensor-001', type: 'traffic', location: 'Main St & 5th Ave' },
      { id: 'air-quality-002', type: 'air-quality', location: 'Downtown Park' },
      { id: 'weather-station-003', type: 'weather', location: 'City Hall' },
      { id: 'parking-sensor-004', type: 'parking', location: 'Shopping District' },
      { id: 'noise-monitor-005', type: 'noise', location: 'Residential Area' },
      { id: 'energy-meter-006', type: 'energy', location: 'Industrial Zone' }
    ];

    const sensorNodes = sensors.map(sensor => {
      const node = this.network.createNode({
        nodeId: sensor.id,
        seed: 7,
        phaseResetInterval: 100
      });

      node.onMessage((message: Message) => {
        console.log(`🏙️ Smart City Hub received: ${message.data.sensorType} data from ${message.data.location}`);
      });

      return { node, sensor };
    });

    // Simulate IoT sensor data
    for (let i = 0; i < 10; i++) {
      await this.delay(1500);
      
      // Randomly select a sensor
      const randomIndex = Math.floor(Math.random() * sensorNodes.length);
      const { node, sensor } = sensorNodes[randomIndex];
      
      const sensorData = this.generateIoTSensorData(sensor.type, sensor.location);
      
      console.log(`📊 ${sensor.id} sending: ${sensor.type} data`);
      
      node.broadcast({
        type: 'iot-sensor-data',
        sensorId: sensor.id,
        sensorType: sensor.type,
        location: sensor.location,
        data: sensorData,
        timestamp: Date.now(),
        batteryLevel: Math.random() * 100,
        signalStrength: Math.random() * 100
      });
    }

    console.log('\n🌟 Smart City IoT demo completed!');
  }

  private generateRandomGameState(): any {
    return {
      worldTime: Date.now(),
      activeEvents: Math.floor(Math.random() * 5),
      serverLoad: Math.random() * 100,
      playersOnline: Math.floor(Math.random() * 1000) + 100,
      weather: ['sunny', 'rainy', 'cloudy', 'stormy'][Math.floor(Math.random() * 4)]
    };
  }

  private generateRequestId(): string {
    return 'req-' + Math.random().toString(36).substr(2, 9);
  }

  private generateServiceMetrics(): any {
    return {
      responseTime: Math.random() * 100,
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      requestCount: Math.floor(Math.random() * 1000),
      errorRate: Math.random() * 5
    };
  }

  private generateIoTSensorData(type: string, _location: string): any {
    const generators = {
      traffic: () => ({
        vehicleCount: Math.floor(Math.random() * 50),
        averageSpeed: Math.random() * 60 + 20,
        congestionLevel: Math.random() * 10,
        accidents: Math.random() > 0.9 ? 1 : 0
      }),
      'air-quality': () => ({
        pm25: Math.random() * 50,
        pm10: Math.random() * 100,
        co2: Math.random() * 500 + 300,
        humidity: Math.random() * 100,
        temperature: Math.random() * 40 - 10
      }),
      weather: () => ({
        temperature: Math.random() * 35 - 5,
        humidity: Math.random() * 100,
        pressure: Math.random() * 100 + 950,
        windSpeed: Math.random() * 30,
        precipitation: Math.random() * 10
      }),
      parking: () => ({
        totalSpaces: 100,
        occupiedSpaces: Math.floor(Math.random() * 100),
        averageOccupancy: Math.random() * 100,
        turnoverRate: Math.random() * 10
      }),
      noise: () => ({
        decibels: Math.random() * 60 + 30,
        frequency: Math.random() * 20000,
        duration: Math.random() * 60,
        type: ['traffic', 'construction', 'ambient'][Math.floor(Math.random() * 3)]
      }),
      energy: () => ({
        consumption: Math.random() * 1000,
        production: Math.random() * 800,
        efficiency: Math.random() * 100,
        gridLoad: Math.random() * 100
      })
    };

    return generators[type as keyof typeof generators]?.() || {};
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}