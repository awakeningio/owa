/**
 *  @file       OWAController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import ControllerWithStore from "./ControllerWithStore"
import SimulatorInputController from "./SimulatorInputController"
import SoundController from "./SoundController"
import SCController from './SCController'
import logger from "./logging"
import * as actionTypes from "./actionTypes"
import AbletonLinkController from "./AbletonLinkController"

import awakeningSequencers from "awakening-sequencers"
//import * as actions from './actions'

class OWAController extends ControllerWithStore {
  init () {
    logger.debug('OWAController.init');
    this.inputController = new SimulatorInputController(this.store);
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



    setTimeout(() => {
      this.store.dispatch(awakeningSequencers.actions.sequencerQueued('level_10-segment_0'));
      //this.store.dispatch(actions.sessionPhaseAdvanced('TRANS_10'));
    }, 5000);
    
  }

  handle_state_change () {
    
  }
}

export default OWAController;
