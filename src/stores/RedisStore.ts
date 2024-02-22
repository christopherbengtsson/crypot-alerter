import { RedisClientType, createClient } from 'redis';
import { HOURLY_TIME_FRAMES, SYMBOLS } from '../constants.js';
import { KlineData } from './DataStore.js';

export class RedisStore {
  client: RedisClientType;

  constructor() {
    this.client = createClient();

    this.client.on('connect', () => {
      console.log('[Redis]: Initiating a connection to the server');
    });
    this.client.on('ready', () => {
      console.log('[Redis]: Client is ready to use');
    });
    this.client.on('end', () => {
      console.log(
        '[Redis]: Connection has been closed (via .quit() or .disconnect()',
      );
    });
    this.client.on('reconnecting', () => {
      console.log('[Redis]: Client is trying to reconnect to the server');
    });
    this.client.on('error', (err) => {
      console.error('[Redis]: An error has occurred', err);
    });
  }

  async connect() {
    return await this.client.connect();
  }

  async getKlines(symbol: SYMBOLS, timeframe: HOURLY_TIME_FRAMES) {
    const key = this.getKey(symbol, timeframe);
    return (await this.client.json.get(key)) as KlineData[];
  }

  async setKlines(
    symbol: SYMBOLS,
    timeframe: HOURLY_TIME_FRAMES,
    klines: KlineData[],
  ) {
    const key = this.getKey(symbol, timeframe);
    return await this.client.json.set(key, '$', klines);
  }

  async addNewKline(
    symbol: SYMBOLS,
    timeframe: HOURLY_TIME_FRAMES,
    kline: KlineData,
  ) {
    const key = this.getKey(symbol, timeframe);
    return await this.client.json.arrAppend(key, '$', kline);
  }

  private getKey(symbol: SYMBOLS, timeframe: HOURLY_TIME_FRAMES) {
    return `${symbol}:${timeframe}`;
  }
}
