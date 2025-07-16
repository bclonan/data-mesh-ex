export interface PatternConfig {
  seed: number;
  phaseResetInterval: number;
}

export interface NodeConfig extends PatternConfig {
  nodeId: string;
}

export interface Message {
  senderId: string;
  globalStep: number;
  patternValue: number;
  data: any;
}

export interface Node {
  nodeId: string;
  globalStep: number;
  broadcast(data: any): void;
  receive(message: Message): void;
  sync(targetStep: number): void;
}