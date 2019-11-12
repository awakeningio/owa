/**
 *
 *  @file       OWAController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { getEnvOrError } from "./utils"
import ControllerWithStore from "./ControllerWithStore"
import OSCActionListener from "./OSCActionListener"
import LightingController from './LightingController'
import SCController from './SCController'
import logger from "./logging"
import * as actionTypes from "./actionTypes"
//import AbletonLinkController from "./AbletonLinkController"
import SerialInputController from './SerialInputController'
import InactivityTimeoutController from './InactivityTimeoutController';

//import SCReduxSequencers from "supercollider-redux-sequencers"
//import * as actions from './actions'

class OWAController extends ControllerWithStore {
  init () {
    const onInit = this.params.onInit || (() => {});
    logger.debug('OWAController.init');
    this.actionListener = new OSCActionListener(this.store, {
      localPort: getEnvOrError('GUI_OSC_OUT_PORT'),
      remotePort: getEnvOrError('GUI_OSC_IN_PORT'),
      remoteHost: getEnvOrError('GUI_HOST')
    });
    this.scController = new SCController(this.store);
    this.store.dispatch({
      type: actionTypes.OWA_SOUND_BOOT_STARTED
    });
    if (!this.params.disableInactivity) {
      this.inactivityTimeoutController = new InactivityTimeoutController(
        this.store
      );
    } else {
      this.inactivityTimeoutController = null;
    }
    this.scController.boot().then(() => {
      this.lightingController = new LightingController(this.store);
      this.serialInputController = new SerialInputController(this.store);

      onInit();
    }).catch((err) => {
      console.log(`ERROR while booting: ${err}`);
      console.log(err.stack);
    });

  }

  handle_state_change () {
    
  }

  quit () {
    return new Promise((resolve, reject) => {
      // quit SC
      this.actionListener.quit();
      if (this.lightingController) {
        this.lightingController.quit();
      }
      if (this.inactivityTimeoutController) {
        this.inactivityTimeoutController.quit();
      }
      this.scController.quit().then(() => resolve()).catch(reject);
    });
  }
}

export default OWAController;
