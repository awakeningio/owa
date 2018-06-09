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
import { getEnvAsNumber } from './utils'


const EXTERNAL_SC = getEnvAsNumber('EXTERNAL_SC');

class SCController {
  quit() {
    return new Promise((resolve, reject) => {
      if (this.sclang) {
        this.sclang.interpret('s.quit();').then(() => {
          return this.sclang.quit().then(() => {
            setTimeout(resolve, 1000);
          }).catch(reject);
        }).catch(reject);
      } else {
        resolve();
      }
    });
  }
  boot() {
    logger.debug('SCController.boot');
    
    return new Promise((resolve, reject) => {
      if (EXTERNAL_SC) {
        return resolve();
      } else {
        logger.debug("Booting SuperCollider...");
        var sclangOptions = {
          debug: process.env.NODE_ENV == "development"
        };
        return sc.lang.boot(sclangOptions).then((sclang) => {
          logger.debug("sclang booted.");
          this.sclang = sclang;
          var scBootScript = `
MIDIClient.init;
MIDIIn.connectAll;
Instr.loadAll();
API.mountDuplexOSC();
s.options.inDevice = "JackRouter";
s.options.outDevice = "JackRouter";
s.options.memSize = 8192 * 2 * 2 * 2;
s.options.blockSize = 128;
          `;
          if (process.env.NODE_ENV === 'development' && process.env.DISABLE_GUI != 1) {
            scBootScript += `
s.meter();
s.plotTree();
            `;
          }

          scBootScript += `
s.waitForBoot({
  OWAController.initInstance();
});
          `
          return sclang.interpret(scBootScript).then(resolve);
        }).catch(reject);
      }
      
    });
  }
}

export default SCController;
