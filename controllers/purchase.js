import { parseJsonBody, validatePurchase } from '../utils/validation.js';
import { sendError, sendSuccess } from '../utils/sendResponse.js';
import PurchaseService from '../services/PurchaseService.js';

export default {
  async processPurchase(req, res) {
    try {
      const data = await parseJsonBody(req);
      const validation = validatePurchase(data);

      if (!validation.isValid) {
        return sendError(res, 400, validation.error);
      }

      const purchase = await PurchaseService.processPurchase(data.amount);
      sendSuccess(res, {
        purchase, 
        message: 'Purchase completed successfully'
      })

    }
    catch (error) {
      sendError(res, 500,  'Purchase failed');
    }

  }
  

}
