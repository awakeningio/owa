/**
 *  @file       logging.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import winston from 'winston'

var logger;

if (process.env.NODE_ENV === 'development') {
  logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple()
  });
  logger.add(new winston.transports.File({
    level: 'debug',
    //format: winston.format.simple(),
    filename: 'combined.log'
  }));
  //logger.add(new winston.transports.Console({
    //colorize: 'all',
    //format: winston.format.simple()
  //}));
} else {
  logger = winston.createLogger({
    level: 'error',
    format: winston.format.simple()
  });
  logger.add(new winston.transports.File({
      level: 'error',
      filename: 'error.log'
  }));

}

export default logger;
