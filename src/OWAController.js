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
import SoundController from "./SoundController"
import LightingController from './LightingController'
import SCController from './SCController'
import logger from "./logging"
import * as actionTypes from "./actionTypes"
//import AbletonLinkController from "./AbletonLinkController"
import SerialInputController from './SerialInputController'

//import awakeningSequencers from "awakening-sequencers"
//import * as actions from './actions'

class OWAController extends ControllerWithStore {
  init () {
    logger.debug('OWAController.init');
    this.actionListener = new OSCActionListener(this.store, {
      localPort: getEnvOrError('GUI_OSC_OUT_PORT'),
      remotePort: getEnvOrError('GUI_OSC_IN_PORT'),
      remoteHost: getEnvOrError('GUI_HOST')
    });
    this.scController = new SCController();
    this.store.dispatch({
      type: actionTypes.OWA_SOUND_BOOT_STARTED
    });
    this.scController.boot().then(() => {
      this.soundController = new SoundController(this.store, {
        //linkStateStore: this.params.linkStateStore
      });
      //this.abletonLinkController = new AbletonLinkController(
        //this.params.linkStateStore,
        //{
          //stateTreePrefix: 'abletonlink'
        //}
      //);
      this.lightingController = new LightingController(this.store);
      this.serialInputController = new SerialInputController(this.store);
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
      this.scController.quit().then(() => {

        this.actionListener.quit();
        this.soundController.quit();
        //this.abletonLinkController.quit();
        this.lightingController.quit();
        resolve();
        
      }).catch(reject);
    });
  }
}

export default OWAController;
