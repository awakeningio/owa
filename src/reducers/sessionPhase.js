/**
 *  @file       sessionPhase.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/
import { SESSION_PHASES, NEXT_SESSION_PHASES } from 'owa/constants';

import {
  getLevel4Ready,
  getLevel2Ready
} from '../selectors';
import * as actionTypes from '../actionTypes';

function action_starts_transition (action, sessionPhase, fullState) {

  const level4Ready = getLevel4Ready(fullState);
  const level2Ready = getLevel2Ready(fullState);

  if (action.type === actionTypes.BUTTON_PRESSED) {
    if (
      (sessionPhase === SESSION_PHASES.IDLE
        && action.payload.levelId === 'level_6')
      || (level4Ready === true
        && action.payload.levelId === 'level_4')
      || (level2Ready === true
        && action.payload.levelId === 'level_2')
    )  {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

export default function sessionPhase (
  state = SESSION_PHASES.IDLE,
  action,
  fullState
) {
  switch (action.type) {
    case actionTypes.SESSION_PHASE_ADVANCED:
      return action.payload.phase;

    case actionTypes.BUTTON_PRESSED:
      if (
        action_starts_transition(action, state, fullState)
      ) {
        return NEXT_SESSION_PHASES[state];
      }
      break;
    case actionTypes.INACTIVITY_TIMEOUT_EXCEEDED:
      return SESSION_PHASES.IDLE;
    default:
      return state;
  }
  return state;
}
