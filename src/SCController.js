/**
 *  @file       SCController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import SCRedux from "supercollider-redux";
//import sc from 'supercolliderjs';
import logger from "./logging";
//import { getEnvAsNumber } from "./utils";
import ControllerWithStore from "./ControllerWithStore";

//const EXTERNAL_SC = getEnvAsNumber("EXTERNAL_SC");
let scBootScript = `
MIDIClient.init;
MIDIIn.connectAll;
Instr.loadAll();
s.options.inDevice = "JackRouter";
s.options.outDevice = "JackRouter";
//s.options.memSize = 65536 * 4;
//s.options.maxNodes = 2048;
//s.options.blockSize = 128;
s.waitForBoot({
s.latency = 0.5;
`;
if (process.env.DEBUG_SC === "1") {
  if (process.env.DISABLE_GUI === "0") {
    scBootScript += `
s.meter();
s.plotTree();
`;
  } else {
    scBootScript += `
Routine {
loop {
s.queryAllNodes();
10.0.wait();
}
}.play();
//s.dumpOSC();
`;
  }
}
scBootScript += `
OWAController.initInstance();
});         `;

/**
 *  Handles starting and stopping the SuperCollider process.
 **/
class SCController extends ControllerWithStore {
  init() {
    this.sclangController = new SCRedux.SCLangController(this.store);
    this.sclang = null;
  }
  boot() {
    return new Promise((res, rej) => {
      return this.sclangController
        .boot()
        .then(sclang => {
          this.sclang = sclang;
          sclang
            .interpret(scBootScript)
            .then(() => {
              this.handleBooted();
              res();
            })
            .catch(rej);
        })
        .catch(rej);
    });
  }
  handleBooted() {
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
        this.sclang.interpret(scsynthGetInfo).then(result => {
          logger.debug(
            `${new Date()} : scsynth info\n${JSON.stringify(result, 4, " ")}`
          );
        });
      }, 5000);
    }
  }
  quit() {
    return this.sclangController.quit();
  }
}

export default SCController;
