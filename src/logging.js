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

var logger = winston.createLogger({
  level: 'info',
  format: winston.format.json()
});

if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    colorize: 'all',
    format: winston.format.simple()
  }));
}

export default logger;
