require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(compression());
app.use(cors());

const logger = require('./logger');

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

app.use('/thumbnails', express.static('./uploads/thumbnails'));

module.exports = app;
