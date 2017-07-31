/**
 *  @file       SimulatorInputController.js
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

class SimulatorInputController extends ControllerWithStore {
  init () {
    this.actionListener = new OSCActionListener(this.store, {
      localPort: getEnvOrError('SIMULATOR_OSC_OUT_PORT'),
      remotePort: getEnvOrError('SIMULATOR_OSC_IN_PORT')
    });
  }
}

export default SimulatorInputController;
