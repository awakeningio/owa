import winston from 'winston'

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: 'all',
      level: 'debug'
    })
  ]
});

export default logger;
