import { RSI } from 'technicalindicators';
import {
  MAX_LOOKBACK_RANGE,
  MIN_LOOKBACK_RANGE,
  PIVOT_LOOKBACK_LEFT,
  PIVOT_LOOKBACK_RIGHT,
  RSI_PERIOD,
} from '../constants.js';
import { pivotHigh, pivotLow } from '../utils/index.js';
import { KlineData } from '../stores/DataStore.js';
import { TriggerAlertProps } from '../alert.js';

export interface RsiDataPoint extends KlineData {
  isPeak: boolean;
  isTrough: boolean;
  rsiValue: number | null;
  index: number;
}

export function checkRsiDivergences(klines: KlineData[]) {
  const rsiDivData = prepareDivergenceData(klines);
  return checkDivergences(rsiDivData);
}

function prepareDivergenceData(klines: KlineData[]): RsiDataPoint[] {
  const closePrices = klines.map(({ close }) => close);

  const rsi = RSI.calculate({
    values: closePrices,
    period: RSI_PERIOD,
  });

  // TODO: Calculate EMA RSI to filter minor or insignificant movements?

  // Find peaks and troughs
  const peaks = pivotHigh(rsi, PIVOT_LOOKBACK_LEFT, PIVOT_LOOKBACK_RIGHT);
  const troughs = pivotLow(rsi, PIVOT_LOOKBACK_LEFT, PIVOT_LOOKBACK_RIGHT);

  // Slice klines to remove the first values that are null from the RSI calculation
  const data = klines.slice(RSI_PERIOD).map((values, index: number) => ({
    ...values,
    isPeak: peaks[index] !== null,
    isTrough: troughs[index] !== null,
    rsiValue: rsi[index],
    index,
  }));

  return data;
}

export function checkDivergences(rsiDivData: RsiDataPoint[]) {
  let bearishRsiDivResult: TriggerAlertProps | undefined;
  let bullishRsiDivResult: TriggerAlertProps | undefined;

  const lastPeak = rsiDivData.findLast(({ isPeak }) => isPeak);
  const lastTrough = rsiDivData.findLast(({ isTrough }) => isTrough);

  // Bearish Divergences: Check divergences of the last peak
  if (lastPeak && lastPeak.rsiValue !== null) {
    bearishRsiDivResult = checkBearishDivergence(rsiDivData, lastPeak);
  }

  // Bullish: Check divergences of the last trough
  if (lastTrough && lastTrough.rsiValue !== null) {
    bullishRsiDivResult = checkBullishDivergence(rsiDivData, lastTrough);
  }

  return { bearishRsiDivResult, bullishRsiDivResult };
}

function checkBullishDivergence(
  rsiDivData: RsiDataPoint[],
  lastTrough: RsiDataPoint,
): TriggerAlertProps | undefined {
  for (let i = 0; i < rsiDivData.length; i++) {
    const previousTrough = rsiDivData[i];

    if (previousTrough.isTrough && previousTrough.index < lastTrough.index) {
      const lookbackDistance = lastTrough.index - previousTrough.index;

      if (
        lookbackDistance >= MIN_LOOKBACK_RANGE &&
        lookbackDistance <= MAX_LOOKBACK_RANGE
      ) {
        // Regular Bullish Divergence Check
        const priceLowerLow = lastTrough.close < previousTrough.close;
        const rsiHigherLow = lastTrough.rsiValue! > previousTrough.rsiValue!;

        if (priceLowerLow && rsiHigherLow) {
          return {
            type: 'rsiDiv',
            alertProps: {
              price: lastTrough.close,
              type: 'regular',
              trend: 'bullish',
            },
          };
        }

        // Hidden Bullish Divergence Check
        const priceHigherLow = lastTrough.close > previousTrough.close;
        const rsiLowerLow = lastTrough.rsiValue! < previousTrough.rsiValue!;

        if (priceHigherLow && rsiLowerLow) {
          return {
            type: 'rsiDiv',
            alertProps: {
              price: lastTrough.close,
              type: 'hidden',
              trend: 'bullish',
            },
          };
        }
      }
    }
  }
}

function checkBearishDivergence(
  rsiDivData: RsiDataPoint[],
  lastPeak: RsiDataPoint,
): TriggerAlertProps | undefined {
  for (let i = 0; i < rsiDivData.length; i++) {
    const previousPeak = rsiDivData[i];
    if (previousPeak.isPeak && previousPeak.index < lastPeak.index) {
      const lookbackDistance = lastPeak.index - previousPeak.index;

      if (
        lookbackDistance >= MIN_LOOKBACK_RANGE &&
        lookbackDistance <= MAX_LOOKBACK_RANGE
      ) {
        // Regular Bearish Divergence Check
        const priceHigherHigh = lastPeak.close > previousPeak.close;
        const rsiLowerHigh = lastPeak.rsiValue! < previousPeak.rsiValue!;

        if (priceHigherHigh && rsiLowerHigh) {
          return {
            type: 'rsiDiv',
            alertProps: {
              price: lastPeak.close,
              type: 'regular',
              trend: 'bearish',
            },
          };
        }

        // Hidden Bearish Divergence Check
        const priceLowerHigh = lastPeak.close < previousPeak.close;
        const rsiHigherHigh = lastPeak.rsiValue! > previousPeak.rsiValue!;

        if (priceLowerHigh && rsiHigherHigh) {
          return {
            type: 'rsiDiv',
            alertProps: {
              price: lastPeak.close,
              type: 'hidden',
              trend: 'bearish',
            },
          };
        }
      }
    }
  }
}

// TODO: Confirmation logic?
function confirmDivergence(
  divergenceType: 'bull' | 'hbull' | 'bear' | 'hbear',
  divergenceRsiDataPoint: RsiDataPoint,
  newKline: RsiDataPoint,
): boolean {
  switch (divergenceType) {
    case 'bull':
      // Bullish divergence confirmation: new kline closing above the high of the wick
      return newKline.close > divergenceRsiDataPoint.high;
    case 'hbull':
      // Hidden bullish divergence confirmation: new kline closing above the high of the wick
      return newKline.close > divergenceRsiDataPoint.high;
    case 'bear':
      // Bearish divergence confirmation: new kline closing below the low of the wick
      return newKline.close < divergenceRsiDataPoint.low;
    case 'hbear':
      // Hidden bearish divergence confirmation: new kline closing below the low of the wick
      return newKline.close < divergenceRsiDataPoint.low;
  }
}
