import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable, index } from 'drizzle-orm/sqlite-core';

export const SYMBOLS_MAP = ['btcusdt'] as const;
export const HOURLY_TIME_FRAMES_MAP = ['4', '8', '12', '24'] as const;
export const ALERT_TYPE_MAP = ['rsiDiv'] as const;

export const cryptoAlerts = sqliteTable(
  'alerts',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    type: text('type', { enum: ALERT_TYPE_MAP }).notNull(),
    klineClosedAt: integer('klineClose', { mode: 'timestamp_ms' }).notNull(),
    symbol: text('symbol', { enum: SYMBOLS_MAP }).notNull(),
    timeframe: text('timeframe', { enum: HOURLY_TIME_FRAMES_MAP }).notNull(),
  },
  (table) => {
    return {
      klineCloseIdx: index('klineCloseIdx').on(table.klineClosedAt),
      symbolIdx: index('symbolIdx').on(table.symbol),
      timeframeIdx: index('timeframeIdx').on(table.timeframe),
    };
  },
);
