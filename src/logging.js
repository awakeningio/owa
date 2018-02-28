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

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: 'all',
      level: 'debug'
    })
  ]
});

export default logger;
