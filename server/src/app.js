const express = require('express');
const compression = require('compression');
const cors = require('cors');
require('dotenv').config();


require('elastic-apm-node').start({
  serviceName: 'mern-video-streaming',
  // secretToken: '',
  serverUrl: process.env.APM_SERVER_URL,
  environment: process.env.NODE_ENV,
  active: process.env.NODE_ENV === "production" || process.env.IS_APM_ACTIVE
})


const app = express();
app.use(express.json());
app.use(compression());
app.use(cors());
app.use('/thumbnails', express.static('./uploads/thumbnails'));

module.exports = app;
