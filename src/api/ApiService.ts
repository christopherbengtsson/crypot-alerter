import { isBefore } from 'date-fns';
import {
  BINANCE_API_BASE_URL,
  HOURLY_TIME_FRAMES,
  SYMBOLS,
} from '../constants.js';
import { KlineData } from '../stores/DataStore.js';
import { MainStore } from '../stores/MainStore.js';
import { timeFrameToInterval } from '../utils/index.js';
import { BinanceApiResponse } from './BinanceTypes.js';

const BINANCE_MAX_LIMIT = 1000;
const TIME_FRAME_MULTIPLIER = 100;

export class ApiService {
  symbol: SYMBOLS;
  timeFrame: HOURLY_TIME_FRAMES;
  historicalLimit: number;
  historicalKlineData: KlineData[] = [];

  constructor(mainStore: MainStore) {
    this.symbol = mainStore.symbol;
    this.timeFrame = mainStore.timeFrame;
    this.historicalLimit = Number(mainStore.timeFrame) * TIME_FRAME_MULTIPLIER;

    if (this.historicalLimit > BINANCE_MAX_LIMIT) {
      this.historicalLimit = BINANCE_MAX_LIMIT;
    }
  }

  async fetchHistoricalData() {
    const response = await fetch(
      `${BINANCE_API_BASE_URL}/klines?symbol=${this.symbol.toUpperCase()}&interval=${timeFrameToInterval(
        this.timeFrame,
      )}&limit=${this.historicalLimit}`,
    );

    // if (!response.ok) {
    //   this.ws?.conn?.close();
    //   console.error(
    //     `Could not fetch historical data for ${
    //       this.symbol
    //     } ${timeFrameToInterval(this.timeFrame)}`,
    //   );
    //   return;
    // }

    const data = (await response.json()) as BinanceApiResponse[];

    const klines = data.map((kline) => ({
      high: parseFloat(kline[2].toString()),
      low: parseFloat(kline[3].toString()),
      close: parseFloat(kline[4].toString()),
      timestamp: parseFloat(kline[6].toString()),
    }));

    console.log(
      `Historical data fetched for ${timeFrameToInterval(
        this.timeFrame,
      )} with length ${klines.length} and limit ${this.historicalLimit}`,
    );

    // Remove newest kline if not yet closed
    const lastKline = klines[klines.length - 1];
    if (isBefore(Date.now(), lastKline.timestamp)) {
      console.log("Removing newest kline since it's not yet closed");
      klines.pop();
    }

    return klines;
  }
}
