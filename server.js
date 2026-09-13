const http = require('node:http');

const port = Number(process.env.PORT || 8080);
let acceptingTraffic = true;

const server = http.createServer((request, response) => {
  if (request.url === '/healthz') {
    response.writeHead(200, { 'content-type': 'application/json' });
    return response.end(JSON.stringify({ ok: true }));
  }
  if (request.url === '/readyz') {
    response.writeHead(acceptingTraffic ? 200 : 503, { 'content-type': 'application/json' });
    return response.end(JSON.stringify({ ready: acceptingTraffic }));
  }
  response.writeHead(404, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ error: 'not_found' }));
});

server.listen(port, '0.0.0.0');

process.on('SIGTERM', () => {
  acceptingTraffic = false;
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 8_000).unref();
});
