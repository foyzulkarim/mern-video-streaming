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

app.setupRoutes = () => {
  const { setup } = require('./modules/models');
  setup(app);
  app.get('/', (req, res) => {
    logger.info(`request received at ${new Date()}`);
    logger.info('req', req.body);
    res.send(`request received at ${new Date()}`);
  });

  // Catch 404 Not Found errors and forward to error handler
  app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
  });

  // Error handler middleware function
  app.use((err, req, res, next) => {
    // Set status code and error message based on error object
    res.status(err.status || 500);
    res.send({
      error: {
        message: err.message,
      },
    });
  });
};

module.exports = app;
