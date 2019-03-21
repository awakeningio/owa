/**
 *  @file       sessionPhaseDurations.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import {
  SESSION_PHASE_DURATIONS_BY_SONGID,
  SESSION_PHASES
} from 'owa/constants';
import {
  SESSION_PHASE_ADVANCED
} from '../actionTypes';
import {
  getSongId
} from '../selectors';
import sessionPhaseDurationsInitialState from 'owa/state/sessionPhaseDurationsInitialState';

export default function sessionPhaseDurations (
  state = sessionPhaseDurationsInitialState,
  action,
  fullState
) {
  switch (action.type) {
    case SESSION_PHASE_ADVANCED:
      if (action.payload.phase === SESSION_PHASES.IDLE) {
        const songId = getSongId(fullState);
        return SESSION_PHASE_DURATIONS_BY_SONGID[songId];
      } else {
        return state;
      }
    
    default:
      return state;
  }
}
