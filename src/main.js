/**
 *  @file       main.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import configureStore from "./configureStore"

import OWAController from "./OWAController"

var owaStateStore = configureStore();
//var abletonLinkStateStore = configureLinkStore();

new OWAController(owaStateStore, {
  //linkStateStore: abletonLinkStateStore
});
