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
import SoundController from "./SoundController"

import awakeningSequencers from 'awakening-sequencers'

const store = configureStore();
const scController = new SCController();
store.dispatch({
  type: actionTypes.OWA_SOUND_BOOT_STARTED
});
scController.boot().then(() => {
  const soundController = new SoundController(store, {});

  setTimeout(function () {
    store.dispatch(awakeningSequencers.actions.sequencerQueued('6_0'));
  }, 7000);
}).catch((err) => {
  console.log(`ERROR while booting supercollider: ${err}`);
});
