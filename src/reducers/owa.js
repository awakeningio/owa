import * as actionTypes from "../actionTypes"

const OWA_READY_STATES = {
  INIT: "INIT",
  READY: "READY"
};

function owa_initial_state () {
  return {
    soundReadyState: false,
    levels: {
    }
  };
}

export default function owa (state = owa_initial_state(), action) {

  switch (action.type) {
    case actionTypes.OWA_SOUND_INIT_STARTED:
      state.soundReadyState = OWA_READY_STATES.INIT;
      break;

    case actionTypes.OWA_SOUND_INIT_DONE:
      state.soundReadyState = OWA_READY_STATES.READY;
      break;
    
    default:
      break;
  }
  return state;
}
