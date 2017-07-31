/**
 *  @file       SoundController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import ControllerWithStore from "./ControllerWithStore"
import OSCActionListener from "./OSCActionListener"
import { getEnvOrError } from "./utils"
import { OWA_READY_STATES } from "./constants"
import * as actionTypes from "./actionTypes"

import sc from 'supercolliderjs';

class SoundController extends ControllerWithStore {
  init () {
    this._apiCallIndex = 0;
    this.actionListener = new OSCActionListener(this.store, {
      localPort: getEnvOrError('SC_OSC_OUT_PORT'),
      remotePort: getEnvOrError('SC_OSC_IN_PORT')
    });

    this.lastState = this.store.getState();
    
    this.store.dispatch({
      type: actionTypes.OWA_SOUND_INIT_STARTED
    });


    this.scapi = null;

    console.log("Booting SuperCollider lang...");
    sc.lang.boot().then((sclang) => {
      let mainFilePath = __dirname + '/../main.sc';
      sclang.executeFile(mainFilePath);
    });

  }

  handle_state_change () {

    var state = this.store.getState();

    if (state.owa.soundReady !== this.lastState.owa.soundReady) {

      if (state.owa.soundReady == OWA_READY_STATES.READY) {
        var api = new sc.scapi();

        this.scapi = api;
        api.log.echo = true;

        api.on("error", function (err) {
          console.log("[SoundController] API ERROR: ");
          console.log(err);
        });

        //console.log("sc api connecting...");
        api.connect();
        this.call("StateStore.init", [this.store.getState()]);
      }
      
    } else {
      if (state.owa.soundReady == OWA_READY_STATES.READY) {
        this.call("StateStore.setState", [state]);
      }
    }

    this.lastState = state;
  }
  getAPICallIndex () {
    if (this._apiCallIndex < Number.MAX_SAFE_INTEGER - 1) {
      this._apiCallIndex++;
    } else {
      this._apiCallIndex = 0;
    }
    return this._apiCallIndex;
  }
  call (apiMethodName, args) {
    return this.scapi.call(this.getAPICallIndex(), apiMethodName, args);
  }
}

export default SoundController;
