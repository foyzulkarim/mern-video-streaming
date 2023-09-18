const os = require('os');
const { createLogger, format, transports } = require('winston');
const { Loggly } = require('winston-loggly-bulk');
require('winston-daily-rotate-file');

class LogManager {
  static instance;
  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      exceptionHandlers: [new transports.File({ filename: 'exception.log' })],
      rejectionHandlers: [new transports.File({ filename: 'rejections.log' })],
      defaultMeta: { service: process.env.npm_lifecycle_event },
      transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
        new transports.DailyRotateFile({
          level: 'info',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        })
      );
    }

    if (process.env.ENABLE_WINSTON_LOGGLY === 'true') {
      this.logger.add(
        new Loggly({
          token: process.env.LOGGLY_TOKEN,
          subdomain: os.hostname().toString(),
          tags: [process.env.npm_lifecycle_event],
          json: true,
        })
      );
    }

    this.logger.info(`Vidiginie system up and running!`, {
      ENABLE_WINSTON_LOGGLY: process.env.ENABLE_WINSTON_LOGGLY,
    });
  }

  getLogger() {
    return this.logger;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new LogManager();
    }

    return this.instance;
  }
}

module.exports = LogManager.getInstance().getLogger();
