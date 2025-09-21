import http from 'http';
import path from 'node:path';
import fs from 'node:fs/promises';

import { getContentType } from './utils/contentTypes.js';
import { sendResponse } from './utils/sendResponse.js';

const __dirname = import.meta.dirname;
const PORT = 3000;

async function serveFile(req, res, basePath) {

  const publicDir = path.join(basePath, 'public');
  const filePath = path.join(publicDir, 
    req.url === '/' ? 'index.html' : req.url
  )
  const ext = path.extname(filePath);

  try {
    const content = await fs.readFile(filePath);
    sendResponse(res, 200, getContentType(ext), content);
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      const content = await fs.readFile(path.join(__dirname, 'public', '404.html'));
      sendResponse(res, 404, 'text/html', content);
    }
    else 
      sendResponse(res, 500, 'text/html', 
      '<html><h1>Internal Server Error ${err.code} </h1></html>'
      )

    
  }
}

const server = http.createServer(async (req, res) => {
  await serveFile(req, res, __dirname);

})

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})