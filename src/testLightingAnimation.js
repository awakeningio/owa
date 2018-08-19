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
import { sessionPhaseAdvanced, buttonPressed } from './actions';
import { SESSION_PHASES } from './constants';

const store = configureStore();
const lightingController = new LightingController(store);

//lightingController.levelTransitionAnimation.start();
//lightingController.revealAnimation.start();

lightingController.level4ReadyAnimation.start();

//let state = store.getState();
////setTimeout(function () {
  ////store.dispatch(
    ////sessionPhaseAdvanced(SESSION_PHASES.IDLE)
  ////);
////}, state.sessionPhaseDurations[SESSION_PHASES.TRANS_ADVICE] / state.tempo * 60000.0);
//setTimeout(function () {
  //store.dispatch(buttonPressed('level_6', 0))
//}, 8000);
