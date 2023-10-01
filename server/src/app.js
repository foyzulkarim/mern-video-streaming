const express = require('express');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./logger');

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

if(!process.env.IS_APM_ACTIVE){
  const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
      stream: {
        // Configure Morgan to use our custom logger with the http severity
        write: (message) => logger.http(message.trim()),
      },
    }
  );
  
  app.use(morganMiddleware);
}


app.use('/thumbnails', express.static('./uploads/thumbnails'));

module.exports = app;
