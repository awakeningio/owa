/**
 *  @file       SCController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import sc from 'supercolliderjs';
import logger from "./logging"


const EXTERNAL_SC = process.env.EXTERNAL_SC;

class SCController {
  boot() {
    logger.debug('SCController.boot');
    
    return new Promise((resolve, reject) => {
      if (EXTERNAL_SC) {
        resolve();
      } else {
        logger.debug("Booting SuperCollider...");
        var sclangOptions = {
          debug: process.env.NODE_ENV == "development"
        };
        return sc.lang.boot(sclangOptions).then((sclang) => {
          logger.debug("sclang booted.");
          return sclang.interpret(`
MIDIClient.init;
MIDIIn.connectAll;
API.mountDuplexOSC();
s.options.inDevice = "JackRouter";
s.options.outDevice = "JackRouter";
s.options.numOutputBusChannels = 48;
s.options.numInputBusChannels = 48;
s.options.memSize = 8192 * 2 * 2 * 2;
s.options.blockSize = 8;

s.waitForBoot({
  OWAController.initInstance();
});
          `).then(resolve);
        }).catch(reject);
      }
      
    });
  }
}

export default SCController;
