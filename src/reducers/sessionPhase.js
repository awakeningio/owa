/**
 *  @file       sessionPhase.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/
import { SESSION_PHASES } from '../constants';

import * as actionTypes from '../actionTypes';

function get_initial_state () {
  return SESSION_PHASES.IDLE;
}
export default function sessionPhase (state = get_initial_state(), action) {
  switch (action.type) {
    case actionTypes.SESSION_PHASE_ADVANCED:
      return action.payload.phase;
    
    default:
      return state;
  }
}
