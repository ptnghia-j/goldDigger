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

  // Remove the leading dot from extension if present
  const cleanExt = ext.startsWith('.') ? ext.slice(1) : ext;
  return contentTypes[cleanExt.toLowerCase()] || 'text/html';
}