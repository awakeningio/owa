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
import { buttonPressed } from './actions'
import SoundController from "./SoundController"
import { SESSION_PHASES } from './constants'

import awakeningSequencers from 'awakening-sequencers'

const store = configureStore({
  sessionPhase: SESSION_PHASES.PLAYING_6
});
const scController = new SCController();
store.dispatch({
  type: actionTypes.OWA_SOUND_BOOT_STARTED
});
let soundController;
scController.boot().then(() => {
  soundController = new SoundController(store, {});

  setTimeout(function () {
    //store.dispatch(awakeningSequencers.actions.sequencerQueued('6_5'));
    store.dispatch(awakeningSequencers.actions.sequencerQueued('6_0'));
    store.dispatch(awakeningSequencers.actions.sequencerQueued('6_1'));
    store.dispatch(awakeningSequencers.actions.sequencerQueued('6_2'));
    store.dispatch(awakeningSequencers.actions.sequencerQueued('6_3'));
    store.dispatch(awakeningSequencers.actions.sequencerQueued('6_4'));
    store.dispatch(buttonPressed('level_6', 5));

    //setTimeout(function () {
      //store.dispatch(buttonPressed('level_4', 0));
      ////store.dispatch(awakeningSequencers.actions.sequencerStopQueued('6_5'));
      ////setTimeout(function () {
        ////store.dispatch(awakeningSequencers.actions.sequencerQueued('6_5'));
      ////}, 750);
    //}, 5000);
    ////store.dispatch(awakeningSequencers.actions.sequencerQueued('trans'));
  }, 7000);
}).catch((err) => {
  console.log(`ERROR while booting supercollider: ${err.stack}`);
  if (soundController) {
    soundController.quit();
  }
  scController.quit();
});
