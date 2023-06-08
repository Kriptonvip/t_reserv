const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://tt-house.host1654944.hostland.pro',
      changeOrigin: true,
    })
  );
};
