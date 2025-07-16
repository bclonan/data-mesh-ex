export class PatternGenerator {
  private seed: number;
  private phaseResetInterval: number;
  private cache: Map<number, number>;

  constructor(seed: number, phaseResetInterval: number) {
    this.seed = seed;
    this.phaseResetInterval = phaseResetInterval;
    this.cache = new Map();
  }

  computeValue(step: number): number {
    // Return cached value if available
    if (this.cache.has(step)) {
      return this.cache.get(step)!;
    }

    // Reset to seed value at phase boundaries
    if (step % this.phaseResetInterval === 0) {
      const value = this.seed;
      this.cache.set(step, value);
      return value;
    }

    // Compute pattern value based on previous steps
    const previousStep = step - 1;
    const previousValue = this.computeValue(previousStep);
    const value = this.collapseDigits(previousValue * this.seed);
    
    this.cache.set(step, value);
    return value;
  }

  private collapseDigits(num: number): number {
    const sum = String(num)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit), 0);
    return sum > 9 ? this.collapseDigits(sum) : sum;
  }

  clearCache(): void {
    this.cache.clear();
  }
}