import { join } from 'node:path';

const __dirname = import.meta.dirname;

export default {
  PORT: process.env.PORT || 3000,
  LOGS_DIR: join(__dirname, 'logs'),
  PURCHASES_LOG: join(__dirname, 'logs', 'purchases.txt'),

  PRICE: {
    BASE: 2000,
    VOLATILITY: 0.02,
    MIN_RATIO: 0.8,
    MAX_RATIO: 1.2,
    ALPHA: 0.7
  },

  PURCHASE: {
    MIN_AMOUNT: 10,
    MAX_AMOUNT: 100000
  }
}