import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import SQLite, { Options } from 'better-sqlite3';
import { DB_FILE_PATH } from '../constants.js';
import { cryptoAlerts } from './schema.js';
import { sql } from 'drizzle-orm';
import { AlertQueryProps } from './types.js';

const dbOptions: Options = {
  verbose: console.log,
  fileMustExist: false,
};

export class Database {
  db: BetterSQLite3Database;

  constructor() {
    const sqlite = new SQLite(DB_FILE_PATH, dbOptions);
    this.db = drizzle(sqlite);

    console.log('Connected to database', `(${DB_FILE_PATH})`);
  }

  async getAllAlerts() {
    return await this.db.select().from(cryptoAlerts);
  }

  async getAlert({ klineClosedAt, symbol, timeframe, type }: AlertQueryProps) {
    return await this.db
      .select()
      .from(cryptoAlerts)
      .where(
        sql`${cryptoAlerts.klineClosedAt} = ${new Date(klineClosedAt)} AND 
        ${cryptoAlerts.symbol} = '${symbol}' AND 
        ${cryptoAlerts.timeframe} = '${timeframe}' AND
        ${cryptoAlerts.type} = '${type}'`,
      );
  }

  async insertAlert({
    type,
    klineClosedAt,
    symbol,
    timeframe,
  }: AlertQueryProps) {
    const alertExists = await this.getAlert({
      type,
      klineClosedAt,
      symbol,
      timeframe,
    });

    if (!alertExists.length) {
      return await this.db.insert(cryptoAlerts).values({
        klineClosedAt: new Date(klineClosedAt),
        symbol,
        timeframe,
        type,
      });
    }
  }
}
