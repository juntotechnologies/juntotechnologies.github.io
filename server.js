const fs = require('fs');
const http = require('http');
const path = require('path');

const root = __dirname;
const preferredPort = Number(process.env.PORT) || 3000;

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function resolveRequestPath(url) {
  const requestedPath = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  const filePath = requestedPath === '/' ? '/index.html' : requestedPath;
  const resolvedPath = path.resolve(root, `.${filePath}`);

  if (!resolvedPath.startsWith(root)) {
    return null;
  }

  return resolvedPath;
}

function serveStaticFile(req, res) {
  const filePath = resolveRequestPath(req.url);

  if (!filePath) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 500);
      res.end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
      return;
    }

    const contentType = mimeTypes[path.extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function listen(port) {
  const server = http.createServer(serveStaticFile);

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      listen(port + 1);
      return;
    }

    throw error;
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

listen(preferredPort);
