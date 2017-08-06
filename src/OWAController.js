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

//import awakeningSequencers from "awakening-sequencers"
import * as actions from './actions'

class OWAController extends ControllerWithStore {
  init () {

    this.inputController = new SimulatorInputController(this.store);
    this.soundController = new SoundController(this.store, {
      linkStateStore: this.params.linkStateStore
    });

    setTimeout(() => {
      //this.store.dispatch(awakeningSequencers.actions.sequencerQueued('level_10-segment_0'));
      this.store.dispatch(actions.sessionPhaseAdvanced('TRANS_10'));
    }, 5000);
    
  }

  handle_state_change () {
    
  }
}

export default OWAController;
