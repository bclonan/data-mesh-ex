import { MeshNode } from './mesh-node';
import type { Message, NodeConfig } from '../types/mesh';

export class MeshNetwork {
  private nodes: Map<string, MeshNode>;

  constructor() {
    this.nodes = new Map();
  }

  createNode(config: NodeConfig): MeshNode {
    const node = new MeshNode(config);
    
    node.onBroadcast((message: Message) => {
      this.broadcast(message, node);
    });

    this.nodes.set(config.nodeId, node);
    return node;
  }

  private broadcast(message: Message, _sender: MeshNode): void {
    this.nodes.forEach((node, nodeId) => {
      if (nodeId !== message.senderId) {
        node.receive(message);
      }
    });
  }

  getNode(nodeId: string): MeshNode | undefined {
    return this.nodes.get(nodeId);
  }

  removeNode(nodeId: string): void {
    this.nodes.delete(nodeId);
  }
}