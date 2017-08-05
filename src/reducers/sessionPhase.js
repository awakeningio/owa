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

export default function sessionPhase (state = SESSION_PHASES.IDLE, action) {
  let nextPhase;
  switch (action.type) {
    case actionTypes.SESSION_PHASE_ADVANCED:
      nextPhase = NEXT_SESSION_PHASES[state];
      state = nextPhase;
      break;
    
    default:
      break
  }
  return state;
}
