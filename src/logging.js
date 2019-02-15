/**
 *  @file       logging.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { createLogger, format, transports } from 'winston'

const logFormat = format.combine(
  format.timestamp(),
  format.printf(({level, message, timestamp}) => (
      `${timestamp} ${level}: ${message}`
  ))
);

var logger;

if (process.env.NODE_ENV === 'development') {
  logger = createLogger({
    level: 'debug',
    format: logFormat,
    transports: [
      new transports.File({
        level: 'debug',
        filename: 'combined.log'
      })
    ]
  });
  //logger.add(new transports.Console({
    //colorize: 'all',
    //format: format.simple()
  //}));
} else {
  logger = createLogger({
    level: 'error',
    format: logFormat,
    transports: [
      new transports.File({
        level: 'error',
        filename: 'error.log'
      })
    ]
  });
}

export default logger;
