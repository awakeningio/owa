/**
 *  @file       testSequencer.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import configureStore from './configureStore'
import SCController from './SCController'
import * as actionTypes from "./actionTypes"
import { sessionPhaseAdvanced } from './actions'
import SoundController from "./SoundController"
import { SESSION_PHASES } from './constants'

//import awakeningSequencers from 'awakening-sequencers'

const store = configureStore();
const scController = new SCController();
store.dispatch({
  type: actionTypes.OWA_SOUND_BOOT_STARTED
});
let soundController;
scController.boot().then(() => {
  soundController = new SoundController(store, {});

  setTimeout(function () {
    store.dispatch(sessionPhaseAdvanced(
        SESSION_PHASES.QUEUE_TRANS_ADVICE
    ));
    //store.dispatch(awakeningSequencers.actions.sequencerQueued('trans'));
  }, 7000);
}).catch((err) => {
  console.log(`ERROR while booting supercollider: ${err.stack}`);
  soundController.quit();
  scController.quit();
});
