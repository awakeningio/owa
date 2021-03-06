/**
 *  @file       testLightingAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/


import configureStore from "../configureStore"
import LightingController from '../LightingController'
import { SESSION_PHASES, SONG_IDS } from 'owa/constants';
//import { sessionPhaseAdvanced, buttonPressed } from './actions';

const store = configureStore({
  sessionPhase: SESSION_PHASES.TRANS_6,
  songId: SONG_IDS.EMINATOR
});
const lightingController = new LightingController(store);

//lightingController.idleAnimation.startIdle();
//lightingController.levelTransitionAnimation.start();
//lightingController.revealAnimation.start();
lightingController.idleAnimation.stop();
setTimeout(function() {
  console.log("Starting animation...");
  console.log(store.getState().segments.allIds);
  const animation = lightingController.segmentLightingControllers[0].variationMenuAnimation;

  //animation.startChoosing();
  animation.startChosen();

  //lightingController.trans2Animation.start();

  //lightingController.revealAnimation.start();
  //setTimeout(() => lightingController.revealAnimation.startAdvice(), 3000);
  //setTimeout(() => animation.stop(), 5000);
  
  //setTimeout(() => animation.startAdvice(), 8000);

}, 1000);



//let state = store.getState();
//setTimeout(function () {
  //store.dispatch(
    //sessionPhaseAdvanced(SESSION_PHASES.IDLE)
  //);
//}, state.sessionPhaseDurations[SESSION_PHASES.TRANS_ADVICE] / state.tempo * 60000.0);
//lightingController.level2ReadyAnimationController.animation.start();
//setTimeout(function () {
  //store.dispatch(buttonPressed('level_6', 0));
  //store.dispatch(buttonPressed('level_6', 1));
  //console.log("stopping...");
  //lightingController.level2ReadyAnimationController.animation.stop();
//}, 8000);
