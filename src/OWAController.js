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

class OWAController extends ControllerWithStore {
  init () {

    this.inputController = new SimulatorInputController(this.store);
    this.soundController = new SoundController(this.store, {
      linkStateStore: this.params.linkStateStore
    });
    
  }

  handle_state_change () {
    
  }
}

export default OWAController;
