import http from 'http';
import config from './config.js';

import apiRoutes from './routes/api.js';
import staticMiddleware from './middleware/static.js';
import corsMiddleware from './middleware/cors.js';

import { sendError } from './utils/sendResponse.js';

const PORT = config.PORT;

const server = http.createServer(async (req, res) => {
  try {
    corsMiddleware(req, res);

    if (req.url.startsWith('/api')) {
      await apiRoutes(req, res);
    }
    else {
      await staticMiddleware(req, res);
    }
  }
  catch (error) {
    sendError(res, 500, 'Internal Server Error');
  }
  
})

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})