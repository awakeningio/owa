/**
 *  @file       testButtonConfig.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import configureStore from "./configureStore"
import SerialInputController from './SerialInputController';

const owaStateStore = configureStore();
new SerialInputController(owaStateStore);

setInterval(function () {
  console.log("tick");
}, 10000);
