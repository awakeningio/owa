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
import { OWA_READY_STATES, SESSION_PHASES, NEXT_SESSION_PHASES } from "./constants"
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

    this.linkStore = this.params.linkStateStore;
    
    this.store.dispatch({
      type: actionTypes.OWA_SOUND_BOOT_STARTED
    });


    this.owaAPI = null;

    if (!process.env.EXTERNAL_SC) {
      console.log("Booting SuperCollider lang...");
      sc.lang.boot().then((sclang) => {
        let mainFilePath = __dirname + '/../main.sc';
        sclang.executeFile(mainFilePath);
      });
    }


  }

  handle_link_state_change () {
    var linkState = this.linkStore.getState();
    this.call("owa.setLinkState", [linkState]).catch((err) => {
      console.log("err");
      console.log(err);
    });
  }

  handle_api_error (err) {
    console.log("API ERROR!");
    console.log("err");
    console.log(err);
  }

  handle_state_change () {

    var state = this.store.getState();

    if (state.soundReady !== this.lastState.soundReady) {

      if (state.soundReady == OWA_READY_STATES.BOOTED) {
        var api = new sc.scapi();
        this.owaAPI = api;
        this.owaAPI.log.echo = true;

        this.owaAPI.on("error", (err) => {
          this.handle_api_error(err);
        });
        this.owaAPI.connect();
        this.linkStore.subscribe(() => {
          this.handle_link_state_change();
        });
        this.call("owa.init", [{
          constants: {
            SESSION_PHASES,
            NEXT_SESSION_PHASES
          }
        }]);
      }
      
    }
    if (state.soundReady == OWA_READY_STATES.READY) {
      this.call("owa.setState", [state]);
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
    return this.owaAPI.call(this.getAPICallIndex(), apiMethodName, args);
  }
}

export default SoundController;
