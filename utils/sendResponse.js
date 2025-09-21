export function sendResponse(res, code, contentType, payload) {
  res.statusCode = code;
  res.setHeader('Content-Type', contentType);
  res.end(payload);
}