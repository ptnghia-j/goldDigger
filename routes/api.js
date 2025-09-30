import config from "../config.js";
import priceController from '../controllers/price.js';
import purchaseController from '../controllers/purchase.js';
import { sendResponse, sendError } from "../utils/sendResponse.js";


const PORT = config.PORT;

export default async function apiRoutes(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);


  if (req.method === 'OPTIONS') {
    return sendResponse(res, 200, 'text/plain', '');
  }

  if (url.pathname === '/api/price' && req.method === 'GET') {
    return priceController.getPrice(req, res);
  }

  if (url.pathname === '/api/purchase' && req.method === 'POST') {
    return purchaseController.processPurchase(req, res);
  }

  sendError(res, 404, 'API endpoint not found');

}
