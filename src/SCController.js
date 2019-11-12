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
import SCAPI from "@supercollider/scapi";
//import sc from 'supercolliderjs';
import logger from "./logging";
//import { getEnvAsNumber } from "./utils";
import ControllerWithStore from "./ControllerWithStore";
import * as constants from "owa/constants";
import { getSCState } from "./selectors";

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
    this.sclangController = new SCRedux.SCLangController(this.store, {
      interpretOnLangBoot: scBootScript
    });
    this.scStoreController = new SCRedux.SCStoreController(this.store, {
      scStateSelector: getSCState
    });
    this.sclang = null;
    this.api = null;

    this.lastState = {};
    this.lastState.soundReady = null;
    const initSub = this.store.subscribe(() => {
      const state = this.store.getState();

      if (state.soundReady !== this.lastState.soundReady) {
        this.lastState.soundReady = state.soundReady;

        if (state.soundReady == constants.OWA_READY_STATES.BOOTED) {
          console.log("calling owa.init");
          const api = new SCAPI();
          api.connect();
          api
            .call(undefined, "owa.init", [
              {
                constants
              }
            ])
            .then(() => {
              api.disconnect();
              initSub();
            }).catch(err => {
              console.log("err");
              console.log(err);
            })
        }
      }
    });
  }
  boot() {
    return new Promise((res, rej) => {
      return this.sclangController
        .boot()
        .then(sclang => {
          this.sclang = sclang;
          this.scStoreController
            .init()
            .then(() => this.handleBooted())
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
    clearInterval(this.debugSCInterval);
    this.scStoreController.quit();
    return this.sclangController.quit();
  }
}

export default SCController;
