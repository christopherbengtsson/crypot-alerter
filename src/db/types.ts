import { ALERT_TYPE, HOURLY_TIME_FRAMES, SYMBOLS } from '../constants.js';

export interface Database {
  triggeredAlerts: TriggeredAlerts;
}

export interface TriggeredAlerts {
  type: ALERT_TYPE;
  klineCloseAt: number;
  drives: number;
}

export interface AlertQueryProps {
  type: ALERT_TYPE;
  klineClosedAt: number;
  symbol: SYMBOLS;
  timeframe: HOURLY_TIME_FRAMES;
}
