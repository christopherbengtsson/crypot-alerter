import {
  ALERT_TYPE_MAP,
  HOURLY_TIME_FRAMES_MAP,
  SYMBOLS_MAP,
} from './db/schema.js';
import { envValueToNumber } from './utils/envValueToNumber.js';

export const isDev = process.env.NODE_ENV !== 'production';

export const DB_NAME = 'crypto-alerts-database';
export const DB_PATH = process.env.DB_PATH;
export const DB_FILE_PATH = isDev ? ':memory:' : `${DB_PATH}${DB_NAME}.db`;

export const BINANCE_WS_BASE_URL = 'wss://stream.binance.com:443/ws';
export const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3';

export type SYMBOLS = (typeof SYMBOLS_MAP)[number];
export type HOURLY_TIME_FRAMES = (typeof HOURLY_TIME_FRAMES_MAP)[number];
export type ALERT_TYPE = (typeof ALERT_TYPE_MAP)[number];

export const RSI_PERIOD = envValueToNumber('RSI_PERIOD') ?? 14;
// export const EMA_PERIOD = 12;

export const PIVOT_LOOKBACK_LEFT = envValueToNumber('PIVOT_LOOKBACK_LEFT') ?? 5;
export const PIVOT_LOOKBACK_RIGHT =
  envValueToNumber('PIVOT_LOOKBACK_RIGHT') ?? 5;

export const MIN_LOOKBACK_RANGE = envValueToNumber('MIN_LOOKBACK_RANGE') ?? 5;
export const MAX_LOOKBACK_RANGE = envValueToNumber('MAX_LOOKBACK_RANGE') ?? 28;

export const PRICE_THRESHOLD = envValueToNumber('PRICE_THRESHOLD') ?? 0;
export const RSI_THRESHOLD = envValueToNumber('RSI_THRESHOLD') ?? 1;
