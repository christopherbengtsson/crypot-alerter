import 'dotenv/config';
import { MainStore } from './stores/MainStore.js';

const btc4h = new MainStore('btcusdt', '4');
btc4h.init();
