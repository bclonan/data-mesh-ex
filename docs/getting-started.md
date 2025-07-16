# Getting Started Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- TypeScript knowledge (recommended)

## Installation

### Clone and Install
```bash
git clone <repository-url>
cd data-mesh
npm install
```

### Verify Installation
```bash
npm test
```

## First Steps

### 1. Start the Web Demo
```bash
npm run dev
```

Open your browser to see the interactive demonstration.

### 2. Run Console Examples
```bash
npm start
```

This runs comprehensive console-based demonstrations.

## Basic Usage

### Creating Your First Network

```typescript
import { MeshNetwork } from './src/core/mesh-network';

// Create a new network
const network = new MeshNetwork();

// Add your first node
const sensorNode = network.createNode({
  nodeId: 'my-sensor-001',
  seed: 7,
  phaseResetInterval: 100
});

console.log('Node created successfully!');
```

### Sending Your First Message

```typescript
// Set up message handling
sensorNode.onMessage((message) => {
  console.log(`Received: ${JSON.stringify(message.data)}`);
});

// Broadcast some data
sensorNode.broadcast({
  type: 'temperature',
  value: 23.5,
  unit: 'celsius'
});
```

### Adding a Second Node

```typescript
// Create another node
const gatewayNode = network.createNode({
  nodeId: 'gateway-001',
  seed: 7,                  // Same seed for synchronization
  phaseResetInterval: 100   // Same interval
});

// Set up message handling
gatewayNode.onMessage((message) => {
  console.log(`Gateway received from ${message.senderId}:`, message.data);
});

// Now when sensor broadcasts, gateway will receive it
sensorNode.broadcast({ status: 'online' });
```

## Key Concepts

### Global Step Synchronization
All nodes maintain a synchronized global step counter:

```typescript
// Node automatically increments step when broadcasting
sensorNode.broadcast({ data: 'first message' });  // Step 0
sensorNode.broadcast({ data: 'second message' }); // Step 1

// Nodes sync to highest step they've seen
gatewayNode.sync(5); // Jump to step 5
```

### Pattern Verification
Messages include pattern values for verification:

```typescript
// When node broadcasts at step 3:
// 1. Computes pattern value for step 3
// 2. Includes pattern in message
// 3. Receiving nodes verify pattern matches

sensorNode.onError((error) => {
  if (error.type === 'pattern-mismatch') {
    console.log('Detected invalid message!');
  }
});
```

### Phase Resets
Every 100 steps (by default), the pattern resets to the seed value:

```typescript
// Step 0: pattern = 7 (seed)
// Step 1: pattern = 4 (7*7=49 → 4+9=13 → 1+3=4)
// Step 2: pattern = 1 (4*7=28 → 2+8=10 → 1+0=1)
// ...
// Step 100: pattern = 7 (reset to seed)
```

## Common Patterns

### Sensor Network
```typescript
// Create multiple sensor nodes
const sensors = ['temp', 'humidity', 'pressure'].map(type => 
  network.createNode({
    nodeId: `${type}-sensor`,
    seed: 7,
    phaseResetInterval: 100
  })
);

// Set up data collection
sensors.forEach(sensor => {
  setInterval(() => {
    sensor.broadcast({
      type: sensor.nodeId,
      value: Math.random() * 100,
      timestamp: Date.now()
    });
  }, 1000);
});
```

### Gateway Pattern
```typescript
// Create a gateway that processes all messages
const gateway = network.createNode({
  nodeId: 'main-gateway',
  seed: 7,
  phaseResetInterval: 100
});

gateway.onMessage((message) => {
  // Process different message types
  switch (message.data.type) {
    case 'temperature':
      handleTemperature(message.data);
      break;
    case 'humidity':
      handleHumidity(message.data);
      break;
    default:
      console.log('Unknown message type:', message.data.type);
  }
});
```

### Observer Pattern
```typescript
import { MeshObserver } from './src/core/mesh-observer';

// Create an observer for monitoring
const observer = new MeshObserver({ seed: 7, phaseResetInterval: 100 });

// Monitor all messages
observer.onValidMessage((message) => {
  console.log(`✅ Valid message from ${message.senderId}`);
});

observer.onAnomaly((anomaly) => {
  console.log(`⚠️ Anomaly detected: ${anomaly.type}`);
  console.log(`Expected: ${anomaly.expected}, Got: ${anomaly.received}`);
});

// Observe messages (you'd typically integrate this with your network)
network.onMessage = (message) => {
  observer.observe(message);
};
```

## Error Handling

### Common Error Types
```typescript
node.onError((error) => {
  switch (error.type) {
    case 'pattern-mismatch':
      console.log('Message failed pattern validation');
      break;
    case 'invalid-step':
      console.log('Message from invalid global step');
      break;
    case 'desync':
      console.log('Node is out of sync');
      break;
    default:
      console.log('Unknown error:', error);
  }
});
```

### Graceful Degradation
```typescript
// Handle network issues gracefully
node.onError((error) => {
  if (error.type === 'pattern-mismatch') {
    // Request resynchronization
    node.sync(getCurrentGlobalStep());
  }
});
```

## Performance Optimization

### Caching
```typescript
// Pattern values are automatically cached
// No need to recompute the same step multiple times
const pattern = new PatternGenerator(7, 100);
const value1 = pattern.computeValue(50); // Computed
const value2 = pattern.computeValue(50); // Cached
```

### Batch Processing
```typescript
// Process multiple messages efficiently
const messages = [];
node.onMessage((message) => {
  messages.push(message);
  
  if (messages.length >= 10) {
    processBatch(messages);
    messages.length = 0;
  }
});
```

## Testing Your Implementation

### Unit Tests
```typescript
import { describe, it, expect } from 'vitest';
import { MeshNode } from './src/core/mesh-node';

describe('My Node Tests', () => {
  it('should handle custom messages', () => {
    const node = new MeshNode({
      nodeId: 'test-node',
      seed: 7,
      phaseResetInterval: 100
    });
    
    // Test your custom functionality
    node.broadcast({ custom: 'data' });
    // Add assertions
  });
});
```

### Integration Tests
```typescript
describe('Network Integration', () => {
  it('should synchronize multiple nodes', async () => {
    const network = new MeshNetwork();
    const nodeA = network.createNode({ nodeId: 'a', seed: 7, phaseResetInterval: 100 });
    const nodeB = network.createNode({ nodeId: 'b', seed: 7, phaseResetInterval: 100 });
    
    let receivedMessage = null;
    nodeB.onMessage((msg) => { receivedMessage = msg; });
    
    nodeA.broadcast({ test: 'data' });
    
    // Verify synchronization
    expect(receivedMessage).toBeTruthy();
    expect(receivedMessage.data.test).toBe('data');
  });
});
```

## Next Steps

1. **Explore the Web Demo**: See all features in action
2. **Read the Architecture Guide**: Understand the system design
3. **Study the Examples**: Learn from practical implementations
4. **Build Custom Nodes**: Create your own network participants
5. **Integrate with Your System**: Connect to existing applications

## Getting Help

- Check the [API Documentation](README.md#api-reference)
- Review the [Architecture Guide](docs/architecture.md)
- Study the [Pattern Theory](docs/pattern-theory.md)
- Run the test suite: `npm test`
- Start with the web demo: `npm run dev`

## Common Issues

### Pattern Mismatches
- Ensure all nodes use the same seed
- Verify phaseResetInterval is consistent
- Check for timing/synchronization issues

### Network Connectivity
- Verify all nodes are in the same network
- Check for firewall or network issues
- Ensure proper node initialization

### Performance Issues
- Monitor cache usage
- Consider batch processing
- Review error handling logic

---

Welcome to the Data Mesh system! Start with the web demo to see everything in action, then dive into building your own distributed applications.