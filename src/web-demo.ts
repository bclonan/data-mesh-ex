import { MeshNetwork } from './core/mesh-network';
import { MeshObserver } from './core/mesh-observer';
import { PatternGenerator } from './core/pattern';
import type { Message } from './types/mesh';

class WebDemo {
  private network: MeshNetwork;
  private observer: MeshObserver;
  private pattern: PatternGenerator;
  private logContainer: HTMLElement;
  private nodeGrid: HTMLElement;
  private patternViz: HTMLElement;
  private messageCount = 0;
  private currentStep = 0;
  private activeNodes = new Set<string>();
  private isRunning = false;

  constructor() {
    this.network = new MeshNetwork();
    this.observer = new MeshObserver({ seed: 7, phaseResetInterval: 100 });
    this.pattern = new PatternGenerator(7, 100);
    
    this.logContainer = document.getElementById('logContainer')!;
    this.nodeGrid = document.getElementById('nodeGrid')!;
    this.patternViz = document.getElementById('patternViz')!;
    
    this.initializeEventListeners();
    this.updatePatternVisualization();
  }

  private initializeEventListeners(): void {
    document.getElementById('startMeshDemo')!.addEventListener('click', () => this.runMeshDemo());
    document.getElementById('startSyncDemo')!.addEventListener('click', () => this.runSyncDemo());
    document.getElementById('startObserverDemo')!.addEventListener('click', () => this.runObserverDemo());
    document.getElementById('startWebDemo')!.addEventListener('click', () => this.runWebApplicationDemo());
    document.getElementById('startMonitoringDemo')!.addEventListener('click', () => this.runMonitoringDemo());
    document.getElementById('startRandomDemo')!.addEventListener('click', () => this.runRandomizedDemo());
    document.getElementById('clearLogs')!.addEventListener('click', () => this.clearLogs());
  }

  private log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info'): void {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    this.logContainer.appendChild(entry);
    this.logContainer.scrollTop = this.logContainer.scrollHeight;
  }

  private updateStats(): void {
    document.getElementById('totalMessages')!.textContent = this.messageCount.toString();
    document.getElementById('activeNodes')!.textContent = this.activeNodes.size.toString();
    document.getElementById('currentStep')!.textContent = this.currentStep.toString();
    
    const observerStats = this.observer.getStatistics();
    const successRate = observerStats.totalObserved > 0 ? observerStats.successRate.toFixed(1) : '100.0';
    document.getElementById('successRate')!.textContent = `${successRate}%`;
  }

  private updateNodeDisplay(nodeId: string, status: string, isActive: boolean = false, isError: boolean = false): void {
    let nodeElement = document.getElementById(`node-${nodeId}`);
    
    if (!nodeElement) {
      nodeElement = document.createElement('div');
      nodeElement.id = `node-${nodeId}`;
      nodeElement.className = 'node';
      nodeElement.innerHTML = `
        <div class="node-id">${nodeId}</div>
        <div class="node-status"></div>
      `;
      this.nodeGrid.appendChild(nodeElement);
      this.activeNodes.add(nodeId);
    }

    nodeElement.className = `node ${isActive ? 'active' : ''} ${isError ? 'error' : ''}`;
    nodeElement.querySelector('.node-status')!.textContent = status;
  }

  private updatePatternVisualization(): void {
    this.patternViz.innerHTML = '';
    
    for (let i = Math.max(0, this.currentStep - 2); i <= this.currentStep + 2; i++) {
      const stepElement = document.createElement('div');
      stepElement.className = `pattern-step ${i === this.currentStep ? 'current' : ''}`;
      stepElement.textContent = this.pattern.computeValue(i).toString();
      this.patternViz.appendChild(stepElement);
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async runMeshDemo(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    this.log('🌐 Starting Mesh Demo...', 'info');
    this.clearNodes();

    // Create nodes
    const nodeConfigs = [
      { nodeId: 'sensor-001', seed: 7, phaseResetInterval: 100 },
      { nodeId: 'sensor-002', seed: 7, phaseResetInterval: 100 },
      { nodeId: 'gateway-001', seed: 7, phaseResetInterval: 100 },
      { nodeId: 'observer-001', seed: 7, phaseResetInterval: 100 }
    ];

    const nodes = nodeConfigs.map(config => {
      const node = this.network.createNode(config);
      this.updateNodeDisplay(config.nodeId, 'Initializing...');
      
      node.onMessage((message: Message) => {
        this.messageCount++;
        this.currentStep = Math.max(this.currentStep, message.globalStep);
        this.updateNodeDisplay(config.nodeId, 'Message received', true);
        this.log(`📨 ${config.nodeId} received: ${JSON.stringify(message.data)}`, 'success');
        this.observer.observe(message);
        
        setTimeout(() => {
          this.updateNodeDisplay(config.nodeId, 'Idle');
        }, 1000);
      });

      node.onError((error) => {
        this.log(`❌ ${config.nodeId} error: ${error.type}`, 'error');
        this.updateNodeDisplay(config.nodeId, 'Error', false, true);
      });

      return node;
    });

    // Set up observer
    this.observer.onValidMessage((message) => {
      this.log(`✅ Observer validated message from ${message.senderId}`, 'success');
    });

    this.observer.onAnomaly((anomaly) => {
      this.log(`⚠️ Observer detected anomaly: ${anomaly.type}`, 'warning');
    });

    // Simulate broadcasts
    this.log('📡 Starting sensor data broadcasts...', 'info');
    
    const broadcasts = [
      { node: nodes[0], data: { type: 'temperature', value: 23.5, unit: 'celsius' } },
      { node: nodes[1], data: { type: 'humidity', value: 65, unit: 'percent' } },
      { node: nodes[2], data: { type: 'status', value: 'online', uptime: 3600 } },
      { node: nodes[3], data: { type: 'observation', value: 'normal_operation', confidence: 0.95 } }
    ];

    for (const broadcast of broadcasts) {
      await this.delay(1500);
      this.updateNodeDisplay(broadcast.node.nodeId, 'Broadcasting...', true);
      this.log(`📡 ${broadcast.node.nodeId} broadcasting data...`, 'info');
      broadcast.node.broadcast(broadcast.data);
      this.updatePatternVisualization();
      this.updateStats();
    }

    this.log('✅ Mesh demo completed successfully!', 'success');
    this.isRunning = false;
  }

  private async runSyncDemo(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    this.log('🔄 Starting Synchronization Demo...', 'info');
    this.clearNodes();

    const nodeA = this.network.createNode({ nodeId: 'node-a', seed: 7, phaseResetInterval: 100 });
    const nodeB = this.network.createNode({ nodeId: 'node-b', seed: 7, phaseResetInterval: 100 });

    this.updateNodeDisplay('node-a', 'Initializing...');
    this.updateNodeDisplay('node-b', 'Initializing...');

    nodeA.onMessage((message: Message) => {
      this.messageCount++;
      this.currentStep = Math.max(this.currentStep, message.globalStep);
      this.updateNodeDisplay('node-a', 'Message received', true);
      this.log(`🔵 Node A received: ${JSON.stringify(message.data)} at step ${message.globalStep}`, 'success');
      this.observer.observe(message);
      
      setTimeout(() => {
        this.updateNodeDisplay('node-a', 'Idle');
      }, 1000);
    });

    nodeB.onMessage((message: Message) => {
      this.messageCount++;
      this.currentStep = Math.max(this.currentStep, message.globalStep);
      this.updateNodeDisplay('node-b', 'Message received', true);
      this.log(`🔴 Node B received: ${JSON.stringify(message.data)} at step ${message.globalStep}`, 'success');
      this.observer.observe(message);
      
      setTimeout(() => {
        this.updateNodeDisplay('node-b', 'Idle');
      }, 1000);
    });

    nodeA.onSync((step) => {
      this.log(`🔄 Node A synchronized to step ${step}`, 'info');
    });

    nodeB.onSync((step) => {
      this.log(`🔄 Node B synchronized to step ${step}`, 'info');
    });

    // Simulate synchronized broadcasts
    this.log('📡 Node A broadcasting at step 0...', 'info');
    this.updateNodeDisplay('node-a', 'Broadcasting...', true);
    nodeA.broadcast({ message: 'Hello from A', timestamp: Date.now() });
    this.updatePatternVisualization();
    this.updateStats();

    await this.delay(2000);

    this.log('📡 Node B broadcasting at step 1...', 'info');
    this.updateNodeDisplay('node-b', 'Broadcasting...', true);
    nodeB.broadcast({ message: 'Hello from B', timestamp: Date.now() });
    this.updatePatternVisualization();
    this.updateStats();

    await this.delay(2000);

    this.log('📡 Node A broadcasting again (should be at step 2)...', 'info');
    this.updateNodeDisplay('node-a', 'Broadcasting...', true);
    nodeA.broadcast({ message: 'Second message from A', timestamp: Date.now() });
    this.updatePatternVisualization();
    this.updateStats();

    this.log('✅ Synchronization demo completed!', 'success');
    this.isRunning = false;
  }

  private async runObserverDemo(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    this.log('🔍 Starting Observer Demo...', 'info');
    this.clearNodes();

    this.updateNodeDisplay('observer', 'Monitoring...');

    // Simulate valid message
    this.log('📨 Simulating valid message...', 'info');
    this.observer.observe({
      senderId: 'test-node',
      globalStep: 0,
      patternValue: 7,
      data: { test: 'valid' }
    });

    await this.delay(1000);

    // Simulate invalid message
    this.log('📨 Simulating invalid message...', 'warning');
    this.observer.observe({
      senderId: 'malicious-node',
      globalStep: 1,
      patternValue: 9, // Wrong pattern value
      data: { test: 'invalid' }
    });

    await this.delay(1000);

    // Show statistics
    const stats = this.observer.getStatistics();
    this.log(`📊 Observer Statistics:`, 'info');
    this.log(`   Total observed: ${stats.totalObserved}`, 'info');
    this.log(`   Valid messages: ${stats.validMessages}`, 'info');
    this.log(`   Anomalies: ${stats.anomalies}`, 'info');
    this.log(`   Success rate: ${stats.successRate.toFixed(2)}%`, 'info');

    this.messageCount = stats.totalObserved;
    this.updateStats();

    this.log('✅ Observer demo completed!', 'success');
    this.isRunning = false;
  }

  private async runWebApplicationDemo(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    this.log('🌐 Starting Distributed Web Application Demo...', 'info');
    this.clearNodes();

    // Simulate collaborative editing
    this.log('📝 Simulating collaborative document editing...', 'info');
    this.updateNodeDisplay('editor-alice', 'Editing document...', true);
    this.updateNodeDisplay('editor-bob', 'Editing document...', true);
    this.updateNodeDisplay('editor-charlie', 'Editing document...', true);

    await this.delay(2000);

    // Simulate random edits
    const editors = ['editor-alice', 'editor-bob', 'editor-charlie'];
    const editTypes = ['insert', 'delete', 'format', 'move'];
    
    for (let i = 0; i < 8; i++) {
      const randomEditor = editors[Math.floor(Math.random() * editors.length)];
      const randomEdit = editTypes[Math.floor(Math.random() * editTypes.length)];
      
      this.updateNodeDisplay(randomEditor, `${randomEdit} operation`, true);
      this.log(`✏️ ${randomEditor} performed ${randomEdit} operation`, 'success');
      this.messageCount++;
      this.currentStep++;
      
      await this.delay(1000);
      this.updateNodeDisplay(randomEditor, 'Idle');
    }

    // Simulate gaming
    this.log('🎮 Simulating distributed gaming...', 'info');
    this.updateNodeDisplay('game-server-us', 'Processing actions...', true);
    this.updateNodeDisplay('game-server-eu', 'Processing actions...', true);
    this.updateNodeDisplay('game-server-asia', 'Processing actions...', true);

    const gameActions = ['player-move', 'player-attack', 'item-pickup', 'spell-cast'];
    for (let i = 0; i < 6; i++) {
      const randomServer = ['game-server-us', 'game-server-eu', 'game-server-asia'][Math.floor(Math.random() * 3)];
      const randomAction = gameActions[Math.floor(Math.random() * gameActions.length)];
      
      this.updateNodeDisplay(randomServer, `${randomAction}`, true);
      this.log(`🎮 ${randomServer} processed ${randomAction}`, 'success');
      this.messageCount++;
      this.currentStep++;
      
      await this.delay(Math.random() * 2000 + 500); // Random delay
      this.updateNodeDisplay(randomServer, 'Online');
    }

    this.updatePatternVisualization();
    this.updateStats();
    this.log('✅ Distributed web application demo completed!', 'success');
    this.isRunning = false;
  }

  private async runMonitoringDemo(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    this.log('🔍 Starting Real-time Monitoring Demo...', 'info');
    this.clearNodes();

    // Security monitoring
    this.log('🔐 Initializing security monitoring...', 'info');
    const securityNodes = ['firewall-001', 'ids-002', 'auth-server-003'];
    
    securityNodes.forEach(node => {
      this.updateNodeDisplay(node, 'Monitoring...', false);
    });

    await this.delay(1000);

    // Simulate security events
    const securityEvents = ['port-scan', 'failed-login', 'privilege-escalation', 'malware-detected'];
    for (let i = 0; i < 5; i++) {
      const randomNode = securityNodes[Math.floor(Math.random() * securityNodes.length)];
      const randomEvent = securityEvents[Math.floor(Math.random() * securityEvents.length)];
      const isCritical = Math.random() > 0.7;
      
      this.updateNodeDisplay(randomNode, `${randomEvent} detected`, true, isCritical);
      this.log(`${isCritical ? '🚨' : '🔍'} ${randomNode} detected: ${randomEvent}`, isCritical ? 'error' : 'warning');
      this.messageCount++;
      this.currentStep++;
      
      await this.delay(1500);
      this.updateNodeDisplay(randomNode, 'Monitoring...');
    }

    // Financial monitoring
    this.log('💰 Starting financial monitoring...', 'info');
    const financialNodes = ['trading-engine', 'fraud-detector', 'risk-analyzer'];
    
    financialNodes.forEach(node => {
      this.updateNodeDisplay(node, 'Processing...', false);
    });

    const financialEvents = ['stock-trade', 'fraud-check', 'risk-assessment', 'compliance-check'];
    for (let i = 0; i < 4; i++) {
      const randomNode = financialNodes[Math.floor(Math.random() * financialNodes.length)];
      const randomEvent = financialEvents[Math.floor(Math.random() * financialEvents.length)];
      
      this.updateNodeDisplay(randomNode, `${randomEvent}`, true);
      this.log(`💰 ${randomNode} processed: ${randomEvent}`, 'success');
      this.messageCount++;
      this.currentStep++;
      
      await this.delay(1800);
      this.updateNodeDisplay(randomNode, 'Processing...');
    }

    this.updatePatternVisualization();
    this.updateStats();
    this.log('✅ Real-time monitoring demo completed!', 'success');
    this.isRunning = false;
  }

  private async runRandomizedDemo(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    this.log('🎲 Starting Randomized Multi-Domain Demo...', 'info');
    this.clearNodes();

    // Create diverse node types
    const nodeTypes = [
      { id: 'iot-sensor', name: 'IoT Sensor', activities: ['temperature', 'humidity', 'motion', 'light'] },
      { id: 'web-server', name: 'Web Server', activities: ['request', 'response', 'cache-hit', 'error'] },
      { id: 'database', name: 'Database', activities: ['query', 'insert', 'update', 'backup'] },
      { id: 'api-gateway', name: 'API Gateway', activities: ['route', 'authenticate', 'rate-limit', 'proxy'] },
      { id: 'ml-processor', name: 'ML Processor', activities: ['train', 'predict', 'validate', 'deploy'] },
      { id: 'blockchain-node', name: 'Blockchain Node', activities: ['mine', 'validate', 'broadcast', 'sync'] }
    ];

    // Initialize all nodes
    nodeTypes.forEach(nodeType => {
      this.updateNodeDisplay(nodeType.id, 'Initializing...', false);
    });

    await this.delay(1000);

    // Run random activities
    for (let i = 0; i < 15; i++) {
      const randomNode = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
      const randomActivity = randomNode.activities[Math.floor(Math.random() * randomNode.activities.length)];
      const isError = Math.random() > 0.9;
      const isActive = Math.random() > 0.3;
      
      this.updateNodeDisplay(randomNode.id, `${randomActivity}`, isActive, isError);
      
      if (isError) {
        this.log(`❌ ${randomNode.name} error during ${randomActivity}`, 'error');
        // Simulate pattern mismatch for errors
        this.observer.observe({
          senderId: randomNode.id,
          globalStep: this.currentStep,
          patternValue: Math.floor(Math.random() * 9) + 1, // Random wrong pattern
          data: { activity: randomActivity, error: true }
        });
      } else {
        this.log(`✅ ${randomNode.name} completed ${randomActivity}`, 'success');
        // Simulate correct pattern
        this.observer.observe({
          senderId: randomNode.id,
          globalStep: this.currentStep,
          patternValue: this.pattern.computeValue(this.currentStep),
          data: { activity: randomActivity, success: true }
        });
      }
      
      this.messageCount++;
      this.currentStep++;
      this.updatePatternVisualization();
      this.updateStats();
      
      await this.delay(Math.random() * 2000 + 500); // Random delay
      
      if (!isError) {
        this.updateNodeDisplay(randomNode.id, 'Idle');
      }
    }

    this.log('🎉 Randomized multi-domain demo completed!', 'success');
    this.log(`📊 Final stats: ${this.messageCount} messages, ${this.observer.getStatistics().anomalies} anomalies`, 'info');
    this.isRunning = false;
  }

  private clearLogs(): void {
    this.logContainer.innerHTML = '';
    this.log('🚀 Data Mesh System initialized', 'info');
    this.log('📡 Ready for demonstrations...', 'info');
  }

  private clearNodes(): void {
    this.nodeGrid.innerHTML = '';
    this.activeNodes.clear();
    this.messageCount = 0;
    this.currentStep = 0;
    this.observer.clearHistory();
    this.updateStats();
  }
}

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new WebDemo();
});