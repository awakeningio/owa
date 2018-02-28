/**
 *  @file       owa.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

//import * as actionTypes from "../actionTypes"
//import {OWA_READY_STATES} from "../constants"

function owa_initial_state () {
  return {
    soundReady: false,
    levels: []
  };
}

export default function owa (state = owa_initial_state(), action) {
  return state;
}
