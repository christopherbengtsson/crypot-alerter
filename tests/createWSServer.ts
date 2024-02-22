import { WebSocketServer } from 'ws';

export function createMockWsServer(port: number) {
  const wss = new WebSocketServer({ port, host: 'localhost' });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      console.log('Received message:', message);
      // Echo the message back to the client
      ws.send(message);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
}
