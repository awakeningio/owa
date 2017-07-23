/**
 *  @file       SimulatorInputController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import osc from "node-osc"

import ControllerWithStore from "./ControllerWithStore"
import { getEnvOrError } from "./utils"

class SimulatorInputController extends ControllerWithStore {
  init () {
    this.oscServer = new osc.Server(
      getEnvOrError("SIMULATOR_INPUT_PORT"),
      "127.0.0.1"
    );
    this.oscServer.on("message", (msg, rinfo) => {
      console.log("msg");
      console.log(msg);
      console.log("rinfo");
      console.log(rinfo);

      var command = msg[0];
      switch (command) {
        case '/button_pressed':
          console.log("msg");
          console.log(msg);
          break;
        
        default:
          break;
      }
    });
    
  }
}

export default SimulatorInputController;
