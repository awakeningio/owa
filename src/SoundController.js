/**
 *  @file       SoundController.js
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
import * as actionTypes from "./actionTypes"

import sc from 'supercolliderjs';

class SoundController extends ControllerWithStore {
  init () {
    this.actionListener = new OSCActionListener(this.store, {
      localPort: getEnvOrError('SC_OSC_OUT_PORT'),
      remotePort: getEnvOrError('SC_OSC_IN_PORT')
    });

    this.store.dispatch({
      type: actionTypes.OWA_SOUND_INIT_STARTED
    });

    console.log("Booting SuperCollider lang...");
    sc.lang.boot().then((sclang) => {
      let mainFilePath = __dirname + '/../main.sc';
      sclang.executeFile(mainFilePath);
    });

  }

  handle_state_change () {
    
  }
}

export default SoundController;
