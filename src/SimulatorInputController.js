/**
 *  @file       SimulatorInputController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import osc from 'osc'

import ControllerWithStore from "./ControllerWithStore"
import { getEnvOrError } from "./utils"

class SimulatorInputController extends ControllerWithStore {
  init () {
    this.oscPort = new osc.UDPPort({
      localAddress: '127.0.0.1',
      localPort: getEnvOrError('SIMULATOR_OSC_OUT_PORT'),
      remoteAddress: '127.0.0.1',
      remotePort: getEnvOrError('SIMULATOR_OSC_IN_PORT')
    });
    this.oscPort.on("message", (msg) => {
      //console.log("msg");
      //console.log(msg);

      let actionPairs = msg.args.slice(1);
      let i;
      let action = {
        type: msg.args[0],
        payload: {}
      };
      for (i = 0; i < actionPairs.length - 1; i+=2) {
        action.payload[actionPairs[i]] = actionPairs[i + 1];
      }

      this.store.dispatch(action);

    });
    this.oscPort.open();
  }
}

export default SimulatorInputController;
