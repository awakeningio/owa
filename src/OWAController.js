/**
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
import SoundController from "./SoundController"
import SCController from './SCController'
import logger from "./logging"
import * as actionTypes from "./actionTypes"
import AbletonLinkController from "./AbletonLinkController"

//import awakeningSequencers from "awakening-sequencers"
//import * as actions from './actions'

class OWAController extends ControllerWithStore {
  init () {
    logger.debug('OWAController.init');
    this.actionListener = new OSCActionListener(this.store, {
      localPort: getEnvOrError('GUI_OSC_OUT_PORT'),
      remotePort: getEnvOrError('GUI_OSC_IN_PORT')
    });
    this.scController = new SCController();
    this.store.dispatch({
      type: actionTypes.OWA_SOUND_BOOT_STARTED
    });
    this.scController.boot().then(() => {
      this.soundController = new SoundController(this.store, {
        linkStateStore: this.params.linkStateStore
      });
      this.abletonLinkController = new AbletonLinkController(
        this.params.linkStateStore,
        {
          stateTreePrefix: 'abletonlink'
        }
      );
    });

  }

  handle_state_change () {
    
  }

  quit () {
    return new Promise((resolve, reject) => {
      // quit SC
      this.scController.quit().then(() => {

        this.actionListener.quit();
        this.soundController.quit();
        this.abletonLinkController.quit();
        resolve();
        
      }).catch(reject);
    });
  }
}

export default OWAController;
