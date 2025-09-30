export function sendResponse(res, code, contentType, payload) {
  res.statusCode = code;
  res.setHeader('Content-Type', contentType);
  res.end(payload);
}

export function sendJson(res, code, data) {
  sendResponse(res, code, 'application/json', JSON.stringify(data));
}

export function sendError(res, code, message) {
  sendJson(res, code, { success: false, error: message });
}

export function sendSuccess(res, data) {
  sendJson(res, 200, { success: true, ...data})
}