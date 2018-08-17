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

const owaStateStore = configureStore();
const lightingController = new LightingController(owaStateStore);

//lightingController.idleModeAnimation.start()
lightingController.level4TransitionAnimation.start();
