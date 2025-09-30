import { sendSuccess, sendError } from '../utils/sendResponse.js';
import priceGenerator from '../services/PriceGen.js';

export default {
  getPrice(req, res) {
    try {
      const priceData = priceGenerator.getCurrentPrice();
      sendSuccess(res, {
        price: priceData.price,
        currency: 'GBP',
        unit: 'per ounce', 
        timestamp: priceData.timestamp
      })
    }
    catch (error) {
      sendError(res, 500, 'Failed to get price');
    }
  }

};

