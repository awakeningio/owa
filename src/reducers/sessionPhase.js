/**
 *  @file       sessionPhase.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/
import { SESSION_PHASES, NEXT_SESSION_PHASES } from '../constants';

import * as actionTypes from '../actionTypes';

function action_starts_transition (action, sessionPhase, level4Ready) {

  if (action.type === actionTypes.BUTTON_PRESSED) {
    if (
      sessionPhase === SESSION_PHASES.IDLE
      && action.payload.levelId === 'level_6'
    ) {
      return true;
    } else if (
      level4Ready === true
      && action.payload.levelId === 'level_4'
    ) {
      return true;
    }
  }
  return false;
}

function get_initial_state () {
  return SESSION_PHASES.QUEUE_TRANS_4;
}
export default function sessionPhase (state = get_initial_state(), action, level4Ready) {
  switch (action.type) {
    case actionTypes.SESSION_PHASE_ADVANCED:
      return action.payload.phase;

    case actionTypes.BUTTON_PRESSED:
      if (
        action_starts_transition(action, state, level4Ready)
      ) {
        return NEXT_SESSION_PHASES[state];
      }
      break;
    
    default:
      return state;
  }
  return state;
}
