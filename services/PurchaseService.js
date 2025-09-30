import fs from 'node:fs/promises';
import path from 'node:path';
import priceGenerator from './PriceGen.js';
import config from '../config.js';

class PurchaseService {
  async ensureLogsDir() {
    try {
      await fs.mkdir(config.LOGS_DIR, { recursive: true });
    }
    catch (error) {
      console.error('Error creating logs directory:', error);
    }
  }

  async processPurchase(amount) {
    const priceData = priceGenerator.getCurrentPrice();
    const goldAmount = amount / priceData.price;
    const timestamp = new Date().toISOString();

    const purchase = {
      amount: parseFloat(amount).toFixed(2),
      pricePerOz: priceData.price.toFixed(2),
      goldAmount: goldAmount.toFixed(4),
      timestamp,
      transactionId: Date.now().toString()
    };

    await this.logPurchase(purchase);
    return purchase;
  }

  async logPurchase(purchase) {
    await this.ensureLogsDir();
    const logEntry = `${purchase.timestamp}, amount paid: £${purchase.amount}, price per oz: £${purchase.pricePerOz}, gold sold: ${purchase.goldAmount} oz \n`;

    try {
      await fs.appendFile(config.PURCHASES_LOG, logEntry);
      console.log( `Purchase logged: ${purchase.transactionId}`)
    }
    catch (error) {
      console.error('Failed to log purchase: ', error);
      throw error;
    }
  }
}

export default new PurchaseService();