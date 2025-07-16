export function validateNodeConfig(config: any): boolean {
  return (
    typeof config === 'object' &&
    typeof config.nodeId === 'string' &&
    typeof config.seed === 'number' &&
    typeof config.phaseResetInterval === 'number' &&
    config.phaseResetInterval > 0
  );
}

export function validateMessage(message: any): boolean {
  return (
    typeof message === 'object' &&
    typeof message.senderId === 'string' &&
    typeof message.globalStep === 'number' &&
    typeof message.patternValue === 'number' &&
    message.globalStep >= 0
  );
}