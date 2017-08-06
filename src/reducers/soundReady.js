import * as actionTypes from "../actionTypes"
import {OWA_READY_STATES} from "../constants"

export default function soundReady (state = false, action) {
  
  switch (action.type) {
    case actionTypes.OWA_SOUND_BOOT_STARTED:
      state = OWA_READY_STATES.BOOTING;
      break;

    case actionTypes.OWA_SOUND_BOOTED:
      state = OWA_READY_STATES.BOOTED;
      break;

    case actionTypes.OWA_SOUND_INIT_DONE:
      state = OWA_READY_STATES.READY;
      break;
    
    default:
      break;
  }
  return state;
}
