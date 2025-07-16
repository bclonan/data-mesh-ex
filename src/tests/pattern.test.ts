import { expect, test, describe } from 'vitest';
import { PatternGenerator } from '../core/pattern';

describe('PatternGenerator', () => {
  test('should generate consistent pattern values', () => {
    const pattern = new PatternGenerator(7, 100);
    
    expect(pattern.computeValue(0)).toBe(7);
    expect(pattern.computeValue(1)).toBe(4);
    expect(pattern.computeValue(2)).toBe(1);
  });

  test('should reset at phase boundaries', () => {
    const pattern = new PatternGenerator(7, 100);
    
    expect(pattern.computeValue(100)).toBe(7);
    expect(pattern.computeValue(200)).toBe(7);
    expect(pattern.computeValue(300)).toBe(7);
  });

  test('should maintain cache consistency', () => {
    const pattern = new PatternGenerator(7, 100);
    
    const firstCompute = pattern.computeValue(50);
    const secondCompute = pattern.computeValue(50);
    
    expect(firstCompute).toBe(secondCompute);
  });
});