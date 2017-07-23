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

class OWAController extends ControllerWithStore {
  init () {

    this.simulatorInputController = new SimulatorInputController(this.store);
    
  }

  handle_state_change () {
    
  }
}

export default OWAController;
