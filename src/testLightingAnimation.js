/**
 *  @file       testLightingAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/


import configureStore from "./configureStore"
import LightingController from './LightingController'
import { sessionPhaseAdvanced } from './actions';
import { SESSION_PHASES } from './constants';

const store = configureStore();
const lightingController = new LightingController(store);

//lightingController.idleModeAnimation.start()
//lightingController.levelTransitionAnimation.start();
lightingController.revealAnimation.start();

let state = store.getState();
setTimeout(function () {
  store.dispatch(
    sessionPhaseAdvanced(SESSION_PHASES.PLAYING_ADVICE)
  );
}, state.sessionPhaseDurations[SESSION_PHASES.TRANS_ADVICE] / state.tempo * 60000.0);
