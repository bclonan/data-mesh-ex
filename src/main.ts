import { MeshDemo } from './examples/mesh-demo';
import { SynchronizationDemo } from './examples/synchronization-demo';
import { DistributedWebDemo } from './examples/distributed-web-demo';
import { RealtimeMonitoringDemo } from './examples/realtime-monitoring-demo';
import { MeshObserver } from './core/mesh-observer';
import { PerformanceMonitor } from './utils/performance-monitor';

async function runDemos(): Promise<void> {
  console.log('🚀 Data Mesh System - Starting Demonstrations\n');
  console.log('=' .repeat(50));

  // Run basic mesh demo
  const meshDemo = new MeshDemo();
  await meshDemo.runDemo();

  console.log('\n' + '=' .repeat(50));

  // Run synchronization demo
  const syncDemo = new SynchronizationDemo();
  await syncDemo.runDemo();

  console.log('\n' + '=' .repeat(50));

  // Run distributed web applications demos
  const webDemo = new DistributedWebDemo();
  
  await webDemo.runCollaborativeEditingDemo();
  console.log('\n' + '=' .repeat(50));
  
  await webDemo.runDistributedGamingDemo();
  console.log('\n' + '=' .repeat(50));
  
  await webDemo.runMicroservicesDemo();
  console.log('\n' + '=' .repeat(50));
  
  await webDemo.runIoTSmartCityDemo();
  console.log('\n' + '=' .repeat(50));

  // Run real-time monitoring demos
  const monitoringDemo = new RealtimeMonitoringDemo();
  
  await monitoringDemo.runSecurityMonitoringDemo();
  console.log('\n' + '=' .repeat(50));
  
  await monitoringDemo.runFinancialMonitoringDemo();
  console.log('\n' + '=' .repeat(50));
  
  await monitoringDemo.runHealthcareMonitoringDemo();
  console.log('\n' + '=' .repeat(50));

  // Demonstrate observer functionality
  console.log('🔍 Starting Observer Demo...\n');
  
  const observer = new MeshObserver({ seed: 7, phaseResetInterval: 100 });
  
  observer.onValidMessage((message) => {
    console.log(`✅ Observer validated message from ${message.senderId}`);
  });

  observer.onAnomaly((anomaly) => {
    console.log(`⚠️  Observer detected anomaly: ${anomaly.type}`);
  });

  // Simulate some observations
  observer.observe({
    senderId: 'test-node',
    globalStep: 0,
    patternValue: 7, // Correct pattern value
    data: { test: 'valid' }
  });

  observer.observe({
    senderId: 'malicious-node',
    globalStep: 1,
    patternValue: 9, // Incorrect pattern value
    data: { test: 'invalid' }
  });

  const stats = observer.getStatistics();
  console.log('\n📊 Observer Statistics:');
  console.log(`   Total observed: ${stats.totalObserved}`);
  console.log(`   Valid messages: ${stats.validMessages}`);
  console.log(`   Anomalies: ${stats.anomalies}`);
  console.log(`   Success rate: ${stats.successRate.toFixed(2)}%`);

  console.log('\n' + '=' .repeat(50));

  // Performance monitoring demo
  console.log('⚡ Performance Monitoring Demo...\n');
  
  const monitor = new PerformanceMonitor();
  
  // Simulate some timed operations
  for (let i = 0; i < 5; i++) {
    monitor.startTimer('pattern-computation');
    // Simulate pattern computation
    await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
    monitor.endTimer('pattern-computation');
  }

  const perfStats = monitor.getAllMetrics();
  console.log('📈 Performance Metrics:');
  console.log(JSON.stringify(perfStats, null, 2));

  console.log('\n🎉 All demonstrations completed successfully!');
  console.log('\n📊 Summary of Demonstrations:');
  console.log('✅ Basic Mesh Networking');
  console.log('✅ Node Synchronization');
  console.log('✅ Collaborative Document Editing');
  console.log('✅ Distributed Gaming');
  console.log('✅ Microservices Communication');
  console.log('✅ IoT Smart City Monitoring');
  console.log('✅ Security Event Monitoring');
  console.log('✅ Financial Transaction Monitoring');
  console.log('✅ Healthcare System Monitoring');
  console.log('✅ Pattern-based Anomaly Detection');
  console.log('✅ Performance Monitoring');
}

// Start the demonstrations
runDemos().catch(console.error);