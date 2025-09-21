export function getContentType(ext) {

  const contentTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'gif': 'image/gif',
    'pdf': 'application/pdf',
    'json': 'application/json'

    // Add more content types as needed
  }

  return contentTypes[ext.toLowerCase()] || 'text/html';
}