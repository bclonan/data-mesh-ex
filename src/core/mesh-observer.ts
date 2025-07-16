import EventEmitter from 'eventemitter3';
import { PatternGenerator } from './pattern';
import type { Message, PatternConfig } from '../types/mesh';

export class MeshObserver {
  private pattern: PatternGenerator;
  private eventEmitter: EventEmitter;
  private observedMessages: Message[] = [];
  private anomalies: any[] = [];

  constructor(config: PatternConfig) {
    this.pattern = new PatternGenerator(config.seed, config.phaseResetInterval);
    this.eventEmitter = new EventEmitter();
  }

  observe(message: Message): void {
    const expectedPattern = this.pattern.computeValue(message.globalStep);
    
    if (expectedPattern !== message.patternValue) {
      const anomaly = {
        type: 'pattern-mismatch',
        message,
        expected: expectedPattern,
        received: message.patternValue,
        timestamp: Date.now()
      };
      
      this.anomalies.push(anomaly);
      this.eventEmitter.emit('anomaly', anomaly);
    } else {
      this.observedMessages.push(message);
      this.eventEmitter.emit('valid-message', message);
    }
  }

  getStatistics(): {
    totalObserved: number;
    validMessages: number;
    anomalies: number;
    successRate: number;
  } {
    const totalObserved = this.observedMessages.length + this.anomalies.length;
    const validMessages = this.observedMessages.length;
    const anomalies = this.anomalies.length;
    const successRate = totalObserved > 0 ? (validMessages / totalObserved) * 100 : 0;

    return {
      totalObserved,
      validMessages,
      anomalies,
      successRate
    };
  }

  onAnomaly(callback: (anomaly: any) => void): void {
    this.eventEmitter.on('anomaly', callback);
  }

  onValidMessage(callback: (message: Message) => void): void {
    this.eventEmitter.on('valid-message', callback);
  }

  clearHistory(): void {
    this.observedMessages = [];
    this.anomalies = [];
  }
}