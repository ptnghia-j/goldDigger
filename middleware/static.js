import path from 'node:path';
import fs from 'node:fs/promises';
import { getContentType } from '../utils/contentTypes.js';
import { sendResponse } from '../utils/sendResponse.js';

const __dirname = import.meta.dirname;

export default async function staticMiddleware(req, res) {
  const publicDir = path.join(__dirname, '..', 'public');
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
      try {
        const content = await fs.readFile(path.join(publicDir, '404.html'));
        sendResponse(res, 404, 'text/html', content);
      }
      catch {
        sendResponse(res, 404, 'text/html', '<h1>404 - Not Found</h1>');
      }
    }
    else 
      sendResponse(res, 500, 'text/html', 
      `<html><h1>Internal Server Error ${err.code} </h1></html>`
      )

  }
}