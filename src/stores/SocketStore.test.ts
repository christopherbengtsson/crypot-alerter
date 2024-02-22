import { WebSocketServer } from 'ws';
import { MainStore } from './MainStore.js';
import { SocketStore } from './SocketStore.js';
import { createMockWsServer } from '../../tests/createWSServer.js';
import { delay } from '../../tests/utils/index.js';
import { CLOSED_KLINE, OPEN_KLINE } from '../../tests/mocks/index.js';
import { WS_PORT } from '../../tests/constants.js';
import { HOURLY_TIME_FRAMES, SYMBOLS } from '../constants.js';

const SYMBOL: SYMBOLS = 'btcusdt';
const TIMEFRAME: HOURLY_TIME_FRAMES = '4';

describe('SocketStore with Mock WebSocket Server', () => {
  let mockServer: WebSocketServer;
  let socketStore: SocketStore;
  let mainStore: MainStore;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mainStore = new MainStore(SYMBOL, TIMEFRAME);
    socketStore = new SocketStore(mainStore);
    socketStore.url = `ws://localhost:${WS_PORT}`;
  });

  beforeAll(() => {
    mockServer = createMockWsServer(WS_PORT);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    mockServer.close();
  });

  test('responds with pong on receiving ping', async () => {
    const pingPongData = 'hello';

    const onPongSpy = vi.fn();
    mockServer.on('connection', (ws) => {
      ws.on('pong', onPongSpy);
    });

    const onPingSpy = vi.fn();
    socketStore.onPing = onPingSpy;

    socketStore.connect();
    await delay();

    mockServer.clients.forEach((client) => {
      client.ping(pingPongData);
    });
    await delay();

    expect(onPingSpy).toHaveBeenCalledWith(Buffer.from(pingPongData));
    await delay();

    expect(onPongSpy).toHaveBeenCalledWith(Buffer.from(pingPongData));
  });

  test('onMessage func', async () => {
    const onMessageSpy = vi.fn();
    socketStore.onMessage = onMessageSpy;

    socketStore.connect();
    await delay();

    const closedKline = JSON.stringify(CLOSED_KLINE);

    mockServer.clients.forEach((client) => {
      client.send(closedKline);
    });
    await delay();

    // The first argument of the first call to onMessageSpy should be a Buffer
    const receivedArg = onMessageSpy.mock.calls[0][0];

    // Check if the received argument is a Buffer and its content matches the expected data
    expect(Buffer.isBuffer(receivedArg)).toBe(true);
    expect(receivedArg.toString()).toBe(closedKline);
  });

  test('calls updateKlines on closed klines', async () => {
    const updateKlinesSpy = vi.fn();
    socketStore.updateKlines = updateKlinesSpy;

    socketStore.connect();
    await delay();

    const closedKline = JSON.stringify(CLOSED_KLINE);

    mockServer.clients.forEach((client) => {
      client.send(closedKline);
    });

    await delay();

    expect(updateKlinesSpy).toHaveBeenCalledWith(CLOSED_KLINE);
  });

  test('it doesnt call updateKlines on open klines', async () => {
    const updateKlinesSpy = vi.fn();
    socketStore.updateKlines = updateKlinesSpy;

    socketStore.connect();
    await delay();

    const openKline = JSON.stringify(OPEN_KLINE);

    mockServer.clients.forEach((client) => {
      client.send(openKline);
    });
    await delay();

    expect(updateKlinesSpy).not.toHaveBeenCalledWith(OPEN_KLINE);
  });

  describe('reconnect', () => {
    test('it reconnects after onClose', async () => {
      const onOpenSpy = vi.fn();
      socketStore.onOpen = onOpenSpy;

      socketStore.connect();

      await delay();

      expect(onOpenSpy).toHaveBeenCalled();
      onOpenSpy.mockReset();

      mockServer.clients.forEach((client) => {
        client.close();
      });

      await delay();

      vi.advanceTimersByTime(1000);

      await delay();

      expect(onOpenSpy).toHaveBeenCalled();

      /** ------------------------------------ */

      onOpenSpy.mockReset();
      socketStore.reconnectAttempts = 2;
      await delay();

      mockServer.clients.forEach((client) => {
        client.close();
      });

      await delay();

      vi.advanceTimersByTime(40000);
      expect(onOpenSpy).not.toHaveBeenCalled();
      onOpenSpy.mockReset();

      vi.advanceTimersByTime(20000);

      await delay();

      expect(onOpenSpy).toHaveBeenCalled();
    });

    test('it doesnt reconnects after 3 attemps', async () => {
      const onOpenSpy = vi.fn();
      socketStore.onOpen = onOpenSpy;

      socketStore.reconnectAttempts = 3;

      socketStore.connect();

      await delay();

      expect(onOpenSpy).toHaveBeenCalled();
      onOpenSpy.mockReset();

      mockServer.clients.forEach((client) => {
        client.close();
      });

      await delay();

      vi.advanceTimersByTime(1000);

      await delay();

      expect(onOpenSpy).not.toHaveBeenCalled();
    });
  });
});
