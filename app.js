const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')
const auth = require('./middlewares/auth');
const app = express();
const target = process.env.TARGET || 'http://www.example.org'
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

app
  .use(cors())
  .use(bodyParser())
  .use(auth())
  .use('/api', createProxyMiddleware({ target: target, changeOrigin: true }));

app.listen(port);
