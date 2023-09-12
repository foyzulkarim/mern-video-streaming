const { createLogger, format, transports } = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');
const { Loggly } = require('winston-loggly-bulk');

const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: 'http://localhost:9200',
    auth: {
      username: 'elastic',
      password: 'changeme',
    },
  },
};
const esTransport = new ElasticsearchTransport(esTransportOpts);

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
      defaultMeta: { service: 'user-service' },
      transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
        new transports.Console(),
        esTransport,
        new Loggly({
          token: process.env.LOGGLY_TOKEN,
          subdomain: 'self18',
          tags: ['Winston-NodeJS'],
          json: true,
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

// const pino = require('pino');
// const ecsFormat = require('@elastic/ecs-pino-format')();
// const pinoElastic = require('pino-elasticsearch');

// // using `docker-elk` repository setup as the ELK server
// const streamToElastic = pinoElastic({
//   index: 'an-index',
//   node: 'http://localhost:9200',
//   auth: {
//     username: 'elastic',
//     password: 'changeme'
//   },
//   esVersion: 7,
//   flushBytes: 1000,
// });

// const logger = pino({ level: 'debug', ...ecsFormat }, streamToElastic);
// logger.info('hello world');

// streamToElastic.on('insertError', (error) => console.log(error));

// module.exports = logger;
