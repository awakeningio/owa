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
