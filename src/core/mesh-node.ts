import EventEmitter from 'eventemitter3';
import { PatternGenerator } from './pattern';
import type { NodeConfig, Message } from '../types/mesh';

export class MeshNode {
  public nodeId: string;
  private pattern: PatternGenerator;
  private eventEmitter: EventEmitter;
  private globalStep: number;

  constructor(config: NodeConfig) {
    this.nodeId = config.nodeId;
    this.pattern = new PatternGenerator(config.seed, config.phaseResetInterval);
    this.eventEmitter = new EventEmitter();
    this.globalStep = 0;
  }

  broadcast(data: any): void {
    const message: Message = {
      senderId: this.nodeId,
      globalStep: this.globalStep,
      patternValue: this.pattern.computeValue(this.globalStep),
      data
    };

    this.eventEmitter.emit('broadcast', message);
    this.incrementStep();
  }

  receive(message: Message): void {
    const expectedPattern = this.pattern.computeValue(message.globalStep);
    
    if (expectedPattern !== message.patternValue) {
      this.eventEmitter.emit('error', {
        type: 'pattern-mismatch',
        message,
        expected: expectedPattern
      });
      return;
    }

    this.sync(message.globalStep);
    this.eventEmitter.emit('message', message);
  }

  sync(targetStep: number): void {
    if (targetStep > this.globalStep) {
      this.globalStep = targetStep;
      this.eventEmitter.emit('sync', this.globalStep);
    }
  }

  private incrementStep(): void {
    this.globalStep++;
  }

  onBroadcast(callback: (message: Message) => void): void {
    this.eventEmitter.on('broadcast', callback);
  }

  onMessage(callback: (message: Message) => void): void {
    this.eventEmitter.on('message', callback);
  }

  onError(callback: (error: any) => void): void {
    this.eventEmitter.on('error', callback);
  }

  onSync(callback: (step: number) => void): void {
    this.eventEmitter.on('sync', callback);
  }
}