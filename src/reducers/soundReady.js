import * as actionTypes from "../actionTypes"
import {OWA_READY_STATES} from "../constants"

export default function soundReady (state = false, action) {
  
  switch (action.type) {
    case actionTypes.OWA_SOUND_BOOT_STARTED:
      return OWA_READY_STATES.BOOTING;

    case actionTypes.OWA_SOUND_BOOTED:
      return OWA_READY_STATES.BOOTED;

    case actionTypes.OWA_SOUND_INIT_DONE:
      return OWA_READY_STATES.READY;
    
    default:
      return state;
  }
}
