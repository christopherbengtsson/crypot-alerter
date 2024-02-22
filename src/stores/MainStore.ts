import { KlineData } from './DataStore.js';
import { checkRsiDivergences } from '../indicators/RSIDivergence.js';
import { SocketStore } from './SocketStore.js';
import { Database } from '../db/Database.js';
import { triggerAlert } from '../alert.js';
import { HOURLY_TIME_FRAMES, SYMBOLS } from '../constants.js';
import { RedisStore } from './RedisStore.js';
import { ApiService } from '../api/ApiService.js';

export class MainStore {
  private redisStore: RedisStore;
  private socketStore: SocketStore;
  private database: Database;
  private apiService: ApiService;

  symbol: SYMBOLS;
  timeFrame: HOURLY_TIME_FRAMES;

  constructor(symbol: SYMBOLS, timeFrame: HOURLY_TIME_FRAMES) {
    this.symbol = symbol;
    this.timeFrame = timeFrame;

    this.apiService = new ApiService(this);
    this.database = new Database();
    this.redisStore = new RedisStore(); // Keep data in cache
    this.socketStore = new SocketStore(this); // For continusly updating data
  }

  async init() {
    await this.redisStore.connect();

    const klines = await this.apiService.fetchHistoricalData();

    await this.redisStore.setKlines(this.symbol, this.timeFrame, klines);

    this.socketStore.connect();
  }

  public async updateKlines(newKline: KlineData) {
    await this.redisStore.addNewKline(this.symbol, this.timeFrame, newKline);
    this.checkForSignals();
  }

  private async checkForSignals() {
    /**
     * checkRsiDivergences(): {
        bearishRsiDivResult: TriggerAlertProps | undefined;
        bullishRsiDivResult: TriggerAlertProps | undefined;
      }
     */
    const klines = await this.redisStore.getKlines(this.symbol, this.timeFrame);
    const rsiDivResults = checkRsiDivergences(klines);

    const allResults = {
      ...rsiDivResults,
    };

    for (const key in allResults) {
      const resultObject = allResults[key as keyof typeof allResults];

      if (resultObject) {
        const { type, alertProps } = resultObject;

        triggerAlert({
          type,
          alertProps,
        });
      }
    }
  }
}
