import WebSocket from 'ws';
import {
  BINANCE_WS_BASE_URL,
  SYMBOLS,
  HOURLY_TIME_FRAMES,
} from '../constants.js';
import { timeFrameToInterval } from '../utils/index.js';
import { BinanceWebSocketPayload } from '../api/BinanceTypes.js';
import { MainStore } from './MainStore.js';
import { getWSUrl } from '../utils/getWSUrl.js';

// TODO: Extend WebSocket?
export class SocketStore {
  ws?: WebSocket;
  url: string;
  reconnectAttempts: number = 0;

  private reconnectTimeout?: NodeJS.Timeout;
  private symbol: SYMBOLS;
  private timeFrame: HOURLY_TIME_FRAMES;

  constructor(public mainStore: MainStore) {
    this.symbol = mainStore.symbol;
    this.timeFrame = mainStore.timeFrame;
    this.url = getWSUrl(BINANCE_WS_BASE_URL, this.symbol, this.timeFrame);
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      return;
    }

    this.ws.on('open', () => this.onOpen());

    this.ws.on('message', (...args) => this.onMessage(...args));

    this.ws.on('ping', (data) => this.onPing(data));

    this.ws.on('close', () => this.onClose());

    this.ws.on('error', (err) => this.onError(err));
  }

  onOpen() {
    console.log(
      'Binance WS connection open for',
      this.symbol.toUpperCase(),
      timeFrameToInterval(this.timeFrame),
    );
    this.reconnectAttempts = 0;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = undefined;
    }
  }
  onMessage(message: WebSocket.RawData, _isBinary: boolean) {
    const payload: BinanceWebSocketPayload = JSON.parse(message.toString());

    // Return if kline is not closed
    if (!payload.k.x) {
      return;
    }

    this.updateKlines(payload);
  }
  onPing(data: Buffer) {
    console.log('ping', data.toString());
    this.ws?.pong(data);
  }
  onClose() {
    console.log('Disconnected from server, attempting to reconnect...');
    this.reconnect();
  }
  onError(error: Error) {
    console.error('WebSocket error:', error);
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
  }

  updateKlines(payload: BinanceWebSocketPayload) {
    this.mainStore.updateKlines({
      timestamp: payload.k.T,
      high: parseFloat(payload.k.h),
      low: parseFloat(payload.k.l),
      close: parseFloat(payload.k.c),
    });

    console.log('New closed kline added to historical data');
  }

  private reconnect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return; // Avoid reconnecting if already connected
    }

    if (this.reconnectAttempts < 3) {
      let delay = 1000;
      if (this.reconnectAttempts === 1) {
        delay = 10000; // 10 seconds
      } else if (this.reconnectAttempts === 2) {
        delay = 60000; // 1 minute
      }

      this.reconnectTimeout = setTimeout(() => {
        console.log(
          `Attempting to reconnect (Attempt ${this.reconnectAttempts + 1})...`,
        );
        this.connect();
      }, delay);
      this.reconnectAttempts++;
    } else {
      console.log(
        'Max reconnect attempts reached. Will not attempt to reconnect.',
      );
    }
  }
}
