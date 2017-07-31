import * as actionTypes from "../actionTypes"
import {OWA_READY_STATES} from "../constants"

function owa_initial_state () {
  return {
    soundReady: false,
    levels: {
    }
  };
}

export default function owa (state = owa_initial_state(), action) {

  switch (action.type) {
    case actionTypes.OWA_SOUND_INIT_STARTED:
      state = Object.assign({}, state);
      state.soundReady = OWA_READY_STATES.INIT;
      break;

    case actionTypes.OWA_SOUND_INIT_DONE:
      state = Object.assign({}, state);
      state.soundReady = OWA_READY_STATES.READY;
      break;
    
    default:
      break;
  }
  return state;
}
