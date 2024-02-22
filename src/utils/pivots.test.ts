import { pivotHigh, pivotLow } from './pivots.js';

describe('pivotHigh', () => {
  it('should identify pivot highs correctly', () => {
    const source = [1, 3, 2, 5, 4];
    const leftBars = 1;
    const rightBars = 1;
    const expected = [null, 3, null, 5, null];
    expect(pivotHigh(source, leftBars, rightBars)).toEqual(expected);
  });

  it('should return all NaNs for non-pivotal data', () => {
    const source = [1, 2, 3, 4, 5];
    const leftBars = 1;
    const rightBars = 1;
    const expected = new Array(source.length).fill(null);
    expect(pivotHigh(source, leftBars, rightBars)).toEqual(expected);
  });

  it('should handle empty arrays', () => {
    const source: number[] = [];
    const leftBars = 1;
    const rightBars = 1;
    expect(pivotHigh(source, leftBars, rightBars)).toEqual([]);
  });

  it('should handle arrays smaller than the sum of leftBars and rightBars', () => {
    const source = [5, 6, 7];
    const leftBars = 2;
    const rightBars = 2;
    expect(pivotHigh(source, leftBars, rightBars)).toEqual([
      null,
      null,
      null,
    ]);
  });

  it('should handle cases where no pivot high is present', () => {
    const source = [1, 2, 3, 4, 5, 6];
    const leftBars = 1;
    const rightBars = 1;
    expect(pivotHigh(source, leftBars, rightBars)).toEqual(
      new Array(source.length).fill(null),
    );
  });
});

describe('pivotLow', () => {
  it('should identify pivot lows correctly', () => {
    const source = [3, 1, 4, 2, 5];
    const leftBars = 1;
    const rightBars = 1;
    const expected = [null, 1, null, 2, null];
    expect(pivotLow(source, leftBars, rightBars)).toEqual(expected);
  });

  it('should return all NaNs for non-pivotal data', () => {
    const source = [5, 4, 3, 2, 1];
    const leftBars = 1;
    const rightBars = 1;
    const expected = new Array(source.length).fill(null);
    expect(pivotLow(source, leftBars, rightBars)).toEqual(expected);
  });

  it('should handle empty arrays', () => {
    const source: number[] = [];
    const leftBars = 1;
    const rightBars = 1;
    expect(pivotLow(source, leftBars, rightBars)).toEqual([]);
  });

  it('should handle arrays smaller than the sum of leftBars and rightBars', () => {
    const source = [3, 2, 1];
    const leftBars = 2;
    const rightBars = 2;
    expect(pivotLow(source, leftBars, rightBars)).toEqual([
      null,
      null,
      null,
    ]);
  });

  it('should handle cases where no pivot low is present', () => {
    const source = [6, 5, 4, 3, 2, 1];
    const leftBars = 1;
    const rightBars = 1;
    expect(pivotLow(source, leftBars, rightBars)).toEqual(
      new Array(source.length).fill(null),
    );
  });
});
