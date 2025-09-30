import http from 'http';
import path from 'node:path';
import fs from 'node:fs/promises';

import { getContentType } from './utils/contentTypes.js';
import { sendResponse } from './utils/sendResponse.js';
import priceGenerator from './services/PriceGen.js';
import { parseJsonBody, validatePurchase } from './utils/validation.js';
import PurchaseService from './services/PurchaseService.js';

const __dirname = import.meta.dirname;
const PORT = 3000;

async function serveFile(req, res, basePath) {

  const publicDir = path.join(basePath, 'public');
  const filePath = path.join(publicDir, 
    req.url === '/' ? 'index.html' : req.url
  )
  const ext = path.extname(filePath);
  const contentType = getContentType(ext)

  try {
    const content = await fs.readFile(filePath, 
      contentType.startsWith('image') ? '' : 'utf8'
    );
    sendResponse(res, 200, contentType, content);
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      const content = await fs.readFile(path.join(publicDir, '404.html'));
      sendResponse(res, 404, 'text/html', content);
    }
    else 
      sendResponse(res, 500, 'text/html', 
      `<html><h1>Internal Server Error ${err.code} </h1></html>`
      )

    
  }
}

async function handleApiRequest(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    sendResponse(res, 200, 'text/plain', '');
    return;
  }

  if (url.pathname === '/api/price' && req.method === 'GET') {
    const priceData = priceGenerator.getCurrentPrice();
    const response = {
      success: true,
      price: priceData.price,
      currency: 'GBP',
      unit: 'per ounce', 
      timestamp: priceData.timestamp
    }

    sendResponse(res, 200, 'application/json', JSON.stringify(response));
    return;
  }

  if (url.pathname === '/api/purchase' && req.method === 'POST') {
    try {
      const data = await parseJsonBody(req);
      const validation = validatePurchase(data);

      if (!validation.isValid) {
        sendResponse(res, 400, 'application/json', JSON.stringify({ success: false, error: validation.error }));
        return;
      }

      const purchase = await PurchaseService.processPurchase(data.amount);
      sendResponse(res, 200, 'application/json', JSON.stringify({
        success: true,
        purchase, 
        message: 'Purchase completed successfully'
      }))

    }
    catch (error) {
      sendResponse(res, 500, 'application/json', JSON.stringify({ success: false, error: 'Purchase failed' }));
    }
    return;
  }

  sendResponse(res, 404, 'application/json', JSON.stringify({ success: false, error: 'API endpoint not found' }))

}

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/api')) {
    await handleApiRequest(req, res);
  }
  else {
    await serveFile(req, res, __dirname);
  }

})

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})