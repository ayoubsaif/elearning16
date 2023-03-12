const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost', // replace this with the URL of your PHP REST API
      changeOrigin: true,
    })
  );
};