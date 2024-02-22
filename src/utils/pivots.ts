export function pivotHigh(
  source: number[],
  leftBars: number,
  rightBars: number,
): (number | null)[] {
  let result = new Array(source.length).fill(null);

  for (let i = leftBars; i < source.length - rightBars; i++) {
    let isPivot = true;

    for (let j = i - leftBars; j <= i + rightBars; j++) {
      if (source[i] <= source[j] && i !== j) {
        isPivot = false;
        break;
      }
    }

    if (isPivot) {
      result[i] = source[i];
    }
  }

  return result;
}

export function pivotLow(
  source: number[],
  leftBars: number,
  rightBars: number,
): (number | null)[] {
  let result = new Array(source.length).fill(null);

  for (let i = leftBars; i < source.length - rightBars; i++) {
    let isPivot = true;

    for (let j = i - leftBars; j <= i + rightBars; j++) {
      if (source[i] >= source[j] && i !== j) {
        isPivot = false;
        break;
      }
    }

    if (isPivot) {
      result[i] = source[i];
    }
  }

  return result;
}
