const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const isInnerFile = pathname.includes('/');
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const fileStream = fs.createReadStream(filepath,{highWaterMark: 6});
      
      res.on('close', () => {
        if (res.finished) return;
        fileStream.destroy();
      })

      if(isInnerFile) {
        res.statusCode = 400;
        res.end('incorrect path');
      }

      fileStream.on('error',(err) => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('file not found');
        } else {
          res.statusCode = 500;
          res.end(`server error: ${ err }`);
        }
      })
      .pipe(res);

      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
