# Data Mesh - Pattern-Based Distributed Synchronization

A TypeScript implementation of a distributed data mesh system that uses deterministic pattern generation for synchronization, verification, and anomaly detection across network nodes.

## 🌐 Live Demo

Run the project to see the interactive web-based demonstration:

```bash
npm run dev
```

Then open your browser to view the live demo interface with:
- Real-time network visualization
- Interactive demos
- Pattern visualization
- System logs and statistics

## 🎯 What is a Data Mesh?

A **Data Mesh** is a distributed architecture approach where multiple nodes (participants) can:
- **Synchronize** without a central authority
- **Broadcast** data with built-in verification
- **Observe** patterns to detect anomalies
- **Maintain** consistency across the network

## 🔧 Core Concept: Pattern-Based Synchronization

### The Pattern System

Our data mesh leverages a **deterministic pattern generation system** that serves as a "shared reference frame" for all network participants.

#### Key Properties:
1. **Deterministic**: Given the same seed and step, every node computes identical pattern values
2. **Self-Regulating**: Periodic phase resets provide synchronization checkpoints
3. **Lightweight**: No heavy consensus required - just agreement on global step count
4. **Verifiable**: Pattern mismatches immediately signal potential issues

#### Pattern Generation Process:
```typescript
// Example: Seed = 7, Step = 0
step 0: 7 (seed value)
step 1: 4 (7 * 7 = 49 → 4+9 = 13 → 1+3 = 4)
step 2: 1 (4 * 7 = 28 → 2+8 = 10 → 1+0 = 1)
step 3: 7 (1 * 7 = 7)
// Pattern continues with digit collapse rules...

// Phase Reset at step 100: Returns to seed value (7)
```

## 🏗️ Architecture Overview

### Core Components

1. **PatternGenerator**: Computes deterministic pattern values
2. **MeshNode**: Network participant that can broadcast/receive messages
3. **MeshNetwork**: Manages node connections and message routing
4. **MeshObserver**: Validates messages and detects anomalies
5. **PerformanceMonitor**: Tracks system performance metrics

### Message Flow

```
Node A (Step 5) → Pattern Value: 3 → Broadcast(data + pattern)
                                    ↓
Network → Routes to all other nodes
                                    ↓
Node B (Step 5) → Computes Pattern: 3 → Validates → Accepts/Rejects
```

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Running Demos

```bash
# Start web demo
npm run dev

# Run console demos
npm start

# Run tests
npm test
```

### Basic Usage

```typescript
import { MeshNetwork } from './src/core/mesh-network';

// Create network
const network = new MeshNetwork();

// Create nodes
const nodeA = network.createNode({
  nodeId: 'sensor-001',
  seed: 7,
  phaseResetInterval: 100
});

const nodeB = network.createNode({
  nodeId: 'gateway-001',
  seed: 7,
  phaseResetInterval: 100
});

// Set up message handling
nodeB.onMessage((message) => {
  console.log('Received:', message.data);
});

// Broadcast data
nodeA.broadcast({ temperature: 23.5, unit: 'celsius' });
```

## 📊 API Reference

### MeshNetwork

```typescript
class MeshNetwork {
  createNode(config: NodeConfig): MeshNode
  getNode(nodeId: string): MeshNode | undefined
  removeNode(nodeId: string): void
}
```

### MeshNode

```typescript
class MeshNode {
  broadcast(data: any): void
  receive(message: Message): void
  sync(targetStep: number): void
  
  // Event listeners
  onMessage(callback: (message: Message) => void): void
  onBroadcast(callback: (message: Message) => void): void
  onError(callback: (error: any) => void): void
  onSync(callback: (step: number) => void): void
}
```

### NodeConfig

```typescript
interface NodeConfig {
  nodeId: string        // Unique identifier
  seed: number         // Pattern generation seed
  phaseResetInterval: number  // Steps between resets
}
```

### Message

```typescript
interface Message {
  senderId: string      // Node that sent the message
  globalStep: number    // Current global step
  patternValue: number  // Expected pattern value
  data: any            // Actual payload
}
```

## 🔍 Pattern Validation

### How It Works

1. **Sender**: Computes pattern value for current step
2. **Receiver**: Independently computes expected pattern value
3. **Validation**: Compares received vs expected pattern
4. **Result**: Accept if match, flag anomaly if mismatch

### Example Validation

```typescript
const observer = new MeshObserver({ seed: 7, phaseResetInterval: 100 });

// Valid message
observer.observe({
  senderId: 'sensor-001',
  globalStep: 0,
  patternValue: 7,  // Correct for step 0
  data: { temp: 23.5 }
});
// ✅ Validation passes

// Invalid message
observer.observe({
  senderId: 'malicious-node',
  globalStep: 0,
  patternValue: 9,  // Incorrect for step 0
  data: { temp: 99.9 }
});
// ❌ Anomaly detected
```

## 🎮 Interactive Demos

### 1. Mesh Network Demo
- Creates 4 nodes (sensors, gateway, observer)
- Simulates real sensor data broadcasting
- Shows message routing and validation

### 2. Synchronization Demo
- Demonstrates global step synchronization
- Shows how nodes catch up when behind
- Validates timing consistency

### 3. Observer Demo
- Shows pattern validation in action
- Demonstrates anomaly detection
- Provides network statistics

## 🔧 Use Cases

### IoT Sensor Networks
```typescript
// Temperature sensor network
const sensorA = network.createNode({
  nodeId: 'temp-sensor-001',
  seed: 7,
  phaseResetInterval: 100
});

sensorA.broadcast({
  type: 'temperature',
  value: 23.5,
  unit: 'celsius',
  timestamp: Date.now()
});
```

### Distributed Systems Monitoring
```typescript
// System health monitoring
const monitor = network.createNode({
  nodeId: 'health-monitor',
  seed: 7,
  phaseResetInterval: 100
});

monitor.onMessage((message) => {
  if (message.senderId.includes('critical-system')) {
    processHealthData(message.data);
  }
});
```

### Real-time Data Validation
```typescript
// Financial transaction validation
const validator = new MeshObserver({ seed: 7, phaseResetInterval: 100 });

validator.onAnomaly((anomaly) => {
  alertSecurity(`Suspicious transaction: ${anomaly.message.data}`);
});
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- Pattern generation correctness
- Node synchronization
- Message validation
- Anomaly detection
- Performance metrics

### Example Test
```typescript
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
```

## 📈 Performance Monitoring

### Built-in Metrics
```typescript
const monitor = new PerformanceMonitor();

// Time operations
monitor.startTimer('pattern-computation');
const result = pattern.computeValue(step);
monitor.endTimer('pattern-computation');

// Get statistics
const stats = monitor.getMetrics('pattern-computation');
console.log(`Average: ${stats.avg}ms`);
```

### Available Metrics
- Pattern computation time
- Message processing time
- Network synchronization time
- Success/failure rates

## 🛡️ Security Features

### Pattern-Based Verification
- Messages validated against deterministic patterns
- Immediate detection of tampering or corruption
- No need for complex cryptographic verification

### Anomaly Detection
- Automatic flagging of pattern mismatches
- Real-time monitoring of network health
- Statistics on success rates and failures

### Distributed Trust
- No single point of failure
- Consensus-free synchronization
- Self-healing network topology

## 🔧 Configuration

### Environment Variables
```bash
# Development
VITE_DEV_MODE=true

# Production
VITE_DEV_MODE=false
```

### Node Configuration
```typescript
const config: NodeConfig = {
  nodeId: 'unique-identifier',
  seed: 7,                    // Pattern seed
  phaseResetInterval: 100     // Reset frequency
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Run the test suite
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Additional Resources

- [Pattern Theory Documentation](docs/pattern-theory.md)
- [Network Architecture Guide](docs/architecture.md)
- [Performance Optimization](docs/performance.md)
- [Security Best Practices](docs/security.md)

---

**Built with TypeScript** • **Real-time synchronization** • **Pattern-based verification** • **Distributed architecture**