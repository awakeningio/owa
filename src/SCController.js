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

/**
 *  Handles starting and stopping the SuperCollider process.
 **/
class SCController {
  constructor () {
    this.debugSCInterval = null;
  }
  quit() {
    return new Promise((resolve, reject) => {
      if (this.debugSCInterval) {
        clearInterval(this.debugSCInterval);
      }
      if (this.sclang) {
        this.sclang.interpret(
          'Server.freeAll(); Server.quitAll();'
        ).then(() => {
          setTimeout(() => {
            this.sclang.quit().then(resolve).catch(reject);
          }, 1000);
        }).catch(reject);
      } else {
        resolve();
      }
    });
  }
  handleBooted () {
    // periodically log scsynth status
    var scsynthGetInfo = `
    (
      'numSynthDefs': s.numSynthDefs(),
      'numSynths': s.numSynths(),
      'numUGens': s.numUGens(),
      'numGroups': s.numGroups(),
      'peakCPU': s.peakCPU(),
      'avgCPU': s.avgCPU()
    );
`;
    if (process.env.DEBUG_SC === "1") {
      this.debugSCInterval = setInterval(() => {
        this.sclang.interpret(scsynthGetInfo).then((result) => {
          logger.debug(
            `${new Date()} : scsynth info\n${JSON.stringify(result, 4, ' ')}`
          );
        });
      }, 5000);
    }
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


s.waitForBoot({
          `;
          if (getEnvAsNumber(process.env.DISABLE_GUI) === 0) {
            scBootScript += `
s.meter();
            `;
          }
          if (process.env.DEBUG_SC === "1") {
            scBootScript += `
  s.dumpOSC();
  Routine {
    loop {
      s.queryAllNodes();

      10.0.wait();
    }
  }.play();
            `;
          }

          scBootScript += `
  OWAController.initInstance();
});
          `;
          return sclang.interpret(scBootScript).then(() => {
            this.handleBooted();
            resolve();
          });
        }).catch(reject);
      }
      
    });
  }
}

export default SCController;
