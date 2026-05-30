const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'public');
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
};

http
  .createServer((req, res) => {
    const pathname = req.url === '/' ? '/index.html' : req.url.split('?')[0];
    const filePath = path.join(root, pathname);

    if (!filePath.startsWith(root)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404).end('Not found');
        return;
      }

      res.writeHead(200, {
        'Content-Type': types[path.extname(filePath)] || 'application/octet-stream',
      });
      res.end(data);
    });
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Local demo site running at http://127.0.0.1:${port}`);
  });
