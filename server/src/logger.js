const os = require('os');
const { createLogger, format, transports } = require('winston');
const { Loggly } = require('winston-loggly-bulk');
require('winston-daily-rotate-file');

class LogManager {
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
      exceptionHandlers: [
        new transports.File({ filename: 'exception.log' }),
      ],
      rejectionHandlers: [
        new transports.File({ filename: 'rejections.log' }),
      ],
      defaultMeta: { service: 'user-service' },
      transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
        new Loggly({
          token: process.env.LOGGLY_TOKEN,
          subdomain: os.hostname(),
          tags: ['Winston-NodeJS'],
          json: true,
        }),
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

    this.logger.log('info', 'Hello World from Node.js!', new Date());
  }

  getLogger() {
    return this.logger;
  }
}

module.exports = new LogManager().getLogger();
