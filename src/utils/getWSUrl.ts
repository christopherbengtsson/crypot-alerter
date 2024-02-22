import { HOURLY_TIME_FRAMES, SYMBOLS } from '../constants.js';
import { timeFrameToInterval } from './timeFrameToInterval.js';

export const getWSUrl = (
  baseURL: string,
  symbol: SYMBOLS,
  timeFrame: HOURLY_TIME_FRAMES,
) =>
  `${baseURL}/${symbol.toLocaleLowerCase()}@kline_${timeFrameToInterval(
    timeFrame,
  )}`;
