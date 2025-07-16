import { MeshNetwork } from '../core/mesh-network';
import { MeshObserver } from '../core/mesh-observer';
import type { Message } from '../types/mesh';

export class RealtimeMonitoringDemo {
  private network: MeshNetwork;
  private observer: MeshObserver;
  private anomalyCount = 0;
  private messageCount = 0;

  constructor() {
    this.network = new MeshNetwork();
    this.observer = new MeshObserver({ seed: 7, phaseResetInterval: 100 });
  }

  async runSecurityMonitoringDemo(): Promise<void> {
    console.log('🔐 Starting Security Monitoring Demo...\n');

    // Create security monitoring nodes
    const securityNodes = [
      { id: 'firewall-001', type: 'firewall', location: 'DMZ' },
      { id: 'ids-002', type: 'intrusion-detection', location: 'Internal Network' },
      { id: 'auth-server-003', type: 'authentication', location: 'Data Center' },
      { id: 'log-analyzer-004', type: 'log-analysis', location: 'Security Operations' },
      { id: 'threat-intel-005', type: 'threat-intelligence', location: 'Cloud Service' }
    ];

    const nodes = securityNodes.map(security => {
      const node = this.network.createNode({
        nodeId: security.id,
        seed: 7,
        phaseResetInterval: 100
      });

      node.onMessage((message: Message) => {
        this.messageCount++;
        if (message.data.severity === 'critical') {
          console.log(`🚨 CRITICAL ALERT: ${security.type} detected ${message.data.threat}`);
        } else {
          console.log(`🔍 ${security.type} reported: ${message.data.event}`);
        }
      });

      node.onError((error) => {
        this.anomalyCount++;
        console.log(`❌ SECURITY ANOMALY: ${security.type} - ${error.type}`);
      });

      return { node, security };
    });

    // Set up observer for anomaly detection
    this.observer.onAnomaly((anomaly) => {
      console.log(`⚠️  PATTERN ANOMALY: Potential security breach detected!`);
      console.log(`   Source: ${anomaly.message.senderId}`);
      console.log(`   Expected: ${anomaly.expected}, Received: ${anomaly.received}`);
    });

    // Simulate security events
    const securityEvents = [
      { node: 0, event: 'port-scan', severity: 'medium', source: '192.168.1.100' },
      { node: 1, event: 'failed-login-attempt', severity: 'low', user: 'admin', attempts: 3 },
      { node: 2, event: 'privilege-escalation', severity: 'high', user: 'user123', target: 'root' },
      { node: 3, event: 'suspicious-file-access', severity: 'medium', file: '/etc/passwd' },
      { node: 4, event: 'malware-signature', severity: 'critical', threat: 'Trojan.Win32.GenKB' }
    ];

    for (const event of securityEvents) {
      await this.delay(2000);
      const { node, security } = nodes[event.node];
      
      const securityData = {
        type: 'security-event',
        event: event.event,
        severity: event.severity,
        timestamp: Date.now(),
        location: security.location,
        details: event,
        riskScore: this.calculateRiskScore(event.severity),
        ...this.generateSecurityMetrics()
      };

      console.log(`🔐 ${security.type} broadcasting: ${event.event} (${event.severity})`);
      
      node.broadcast(securityData);
      this.observer.observe({
        senderId: security.id,
        globalStep: this.messageCount,
        patternValue: 7, // Correct pattern
        data: securityData
      });
    }

    // Simulate a malicious/corrupted message
    await this.delay(1000);
    console.log('\n🎭 Simulating malicious message...');
    
    this.observer.observe({
      senderId: 'unknown-attacker',
      globalStep: this.messageCount + 1,
      patternValue: 9, // Wrong pattern - should trigger anomaly
      data: {
        type: 'fake-security-event',
        event: 'data-exfiltration',
        severity: 'low', // Trying to hide malicious activity
        timestamp: Date.now()
      }
    });

    console.log('\n📊 Security monitoring summary:');
    console.log(`   Messages processed: ${this.messageCount}`);
    console.log(`   Anomalies detected: ${this.anomalyCount}`);
    console.log(`   Pattern violations: ${this.observer.getStatistics().anomalies}`);
  }

  async runFinancialMonitoringDemo(): Promise<void> {
    console.log('💰 Starting Financial Transaction Monitoring Demo...\n');

    // Create financial service nodes
    const financialNodes = [
      { id: 'trading-engine-001', type: 'trading', exchange: 'NYSE' },
      { id: 'fraud-detector-002', type: 'fraud-detection', bank: 'Global Bank' },
      { id: 'risk-analyzer-003', type: 'risk-analysis', firm: 'Investment Corp' },
      { id: 'compliance-monitor-004', type: 'compliance', regulator: 'FinCEN' },
      { id: 'settlement-system-005', type: 'settlement', clearinghouse: 'DTCC' }
    ];

    const nodes = financialNodes.map(financial => {
      const node = this.network.createNode({
        nodeId: financial.id,
        seed: 7,
        phaseResetInterval: 100
      });

      node.onMessage((message: Message) => {
        if (message.data.type === 'transaction') {
          console.log(`💳 ${financial.type} processed: $${message.data.amount} transaction`);
        } else if (message.data.type === 'fraud-alert') {
          console.log(`🚨 FRAUD ALERT: ${message.data.reason} - Score: ${message.data.score}`);
        }
      });

      return { node, financial };
    });

    // Simulate financial transactions and monitoring
    const transactions = [
      { node: 0, type: 'stock-trade', symbol: 'AAPL', amount: 50000, volume: 1000 },
      { node: 1, type: 'fraud-check', transactionId: 'txn-001', score: 0.2, status: 'clear' },
      { node: 2, type: 'risk-assessment', portfolio: 'tech-stocks', risk: 0.65, recommendation: 'hold' },
      { node: 3, type: 'compliance-check', regulation: 'KYC', status: 'passed', customer: 'corp-123' },
      { node: 4, type: 'settlement', amount: 2500000, parties: ['bank-a', 'bank-b'], status: 'completed' }
    ];

    for (const transaction of transactions) {
      await this.delay(1800);
      const { node, financial } = nodes[transaction.node];
      
      const transactionData = {
        type: 'financial-transaction',
        subType: transaction.type,
        timestamp: Date.now(),
        institution: financial.exchange || financial.bank || financial.firm,
        data: transaction,
        riskMetrics: this.generateRiskMetrics(),
        complianceFlags: this.generateComplianceFlags(),
        ...this.generateFinancialMetrics()
      };

      console.log(`💰 ${financial.type} broadcasting: ${transaction.type}`);
      
      node.broadcast(transactionData);
    }

    // Simulate high-risk transaction
    await this.delay(1000);
    console.log('\n🚨 High-risk transaction detected...');
    
    const { node } = nodes[1]; // Fraud detector
    node.broadcast({
      type: 'fraud-alert',
      severity: 'high',
      reason: 'Unusual transaction pattern detected',
      score: 0.87,
      transactionId: 'txn-suspicious-001',
      amount: 1000000,
      timestamp: Date.now(),
      investigationRequired: true
    });

    console.log('\n📈 Financial monitoring completed!');
  }

  async runHealthcareMonitoringDemo(): Promise<void> {
    console.log('🏥 Starting Healthcare Monitoring Demo...\n');

    // Create healthcare monitoring nodes
    const healthcareNodes = [
      { id: 'patient-monitor-001', type: 'vital-signs', ward: 'ICU' },
      { id: 'pharmacy-system-002', type: 'medication', location: 'Central Pharmacy' },
      { id: 'lab-analyzer-003', type: 'lab-results', department: 'Pathology' },
      { id: 'imaging-system-004', type: 'medical-imaging', modality: 'MRI' },
      { id: 'emergency-alert-005', type: 'emergency', location: 'Emergency Room' }
    ];

    const nodes = healthcareNodes.map(healthcare => {
      const node = this.network.createNode({
        nodeId: healthcare.id,
        seed: 7,
        phaseResetInterval: 100
      });

      node.onMessage((message: Message) => {
        if (message.data.priority === 'critical') {
          console.log(`🚨 CRITICAL: ${healthcare.type} - ${message.data.alert}`);
        } else {
          console.log(`🏥 ${healthcare.type} update: ${message.data.status || message.data.result}`);
        }
      });

      return { node, healthcare };
    });

    // Simulate healthcare monitoring events
    const healthcareEvents = [
      { node: 0, event: 'vital-signs-normal', patientId: 'P001', heartRate: 72, bp: '120/80' },
      { node: 1, event: 'medication-dispensed', patientId: 'P002', drug: 'Aspirin', dosage: '81mg' },
      { node: 2, event: 'lab-results-ready', patientId: 'P003', test: 'CBC', result: 'normal' },
      { node: 3, event: 'imaging-complete', patientId: 'P004', scan: 'brain-mri', findings: 'normal' },
      { node: 0, event: 'vital-signs-critical', patientId: 'P005', heartRate: 140, bp: '180/110' }
    ];

    for (const event of healthcareEvents) {
      await this.delay(2200);
      const { node, healthcare } = nodes[event.node];
      
      const healthcareData = {
        type: 'healthcare-event',
        event: event.event,
        timestamp: Date.now(),
        location: healthcare.ward || healthcare.location,
        priority: event.event.includes('critical') ? 'critical' : 'normal',
        data: event,
        ...this.generateHealthcareMetrics()
      };

      console.log(`🏥 ${healthcare.type} broadcasting: ${event.event}`);
      
      node.broadcast(healthcareData);
    }

    console.log('\n💊 Healthcare monitoring demo completed!');
  }

  private calculateRiskScore(severity: string): number {
    const riskMap = { low: 0.2, medium: 0.5, high: 0.8, critical: 0.95 };
    return riskMap[severity as keyof typeof riskMap] || 0.1;
  }

  private generateSecurityMetrics(): any {
    return {
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      networkTraffic: Math.random() * 1000,
      activeConnections: Math.floor(Math.random() * 500),
      blockedAttempts: Math.floor(Math.random() * 50)
    };
  }

  private generateRiskMetrics(): any {
    return {
      volatility: Math.random() * 100,
      correlation: Math.random() * 2 - 1,
      exposure: Math.random() * 1000000,
      var: Math.random() * 50000,
      sharpeRatio: Math.random() * 3
    };
  }

  private generateComplianceFlags(): any {
    return {
      kycCompliant: Math.random() > 0.1,
      amlChecked: Math.random() > 0.05,
      sanctionScreened: Math.random() > 0.02,
      reportingRequired: Math.random() > 0.8
    };
  }

  private generateFinancialMetrics(): any {
    return {
      volume: Math.floor(Math.random() * 1000000),
      price: Math.random() * 500,
      spread: Math.random() * 0.1,
      liquidity: Math.random() * 100,
      marketCap: Math.random() * 1000000000
    };
  }

  private generateHealthcareMetrics(): any {
    return {
      systemLoad: Math.random() * 100,
      responseTime: Math.random() * 500,
      activeAlerts: Math.floor(Math.random() * 10),
      patientsMonitored: Math.floor(Math.random() * 50),
      equipmentStatus: Math.random() > 0.05 ? 'operational' : 'maintenance'
    };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}