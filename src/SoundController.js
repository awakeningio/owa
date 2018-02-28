/**
 *  @file       SoundController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import ControllerWithStore from "./ControllerWithStore"
import OSCActionListener from "./OSCActionListener"
import { getEnvOrError } from "./utils"
import { OWA_READY_STATES, SESSION_PHASES, NEXT_SESSION_PHASES } from "./constants"

import logger from './logging';

import sc from 'supercolliderjs';

class SoundController extends ControllerWithStore {
  init () {
    this._apiCallIndex = 0;
    this.actionListener = new OSCActionListener(this.store, {
      localPort: getEnvOrError('SC_OSC_OUT_PORT'),
      remotePort: getEnvOrError('SC_OSC_IN_PORT')
    });

    this.lastState = {
      soundReady: null
    };

    this.linkStore = this.params.linkStateStore;
    
    this.owaAPI = null;

    this.handle_state_change();
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
      this.lastState.soundReady = state.soundReady;

      if (state.soundReady == OWA_READY_STATES.BOOTED) {
        var api = new sc.scapi();
        this.owaAPI = api;
        this.owaAPI.log.echo = true;

        this.owaAPI.on("error", this.handle_api_error.bind(this));
        logger.debug('SoundController owaAPI.connect');
        this.owaAPI.connect();
        this.linkStore.subscribe(() => {
          this.handle_link_state_change();
        });
        this.handle_link_state_change();
        logger.debug('SoundController calling owa.init');
        this.call("owa.init", [{
          linkState: this.linkStore.getState(),
          state: this.store.getState(),
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
    if (this.owaAPI) {
      return this.owaAPI.call(this.getAPICallIndex(), apiMethodName, args);
    } else {
      return new Promise((res) => {
        res();
      });
    }
  }
}

export default SoundController;
