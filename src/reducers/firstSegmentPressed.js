/**
 *  @file       firstSegmentPressed.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import {
  BUTTON_PRESSED,
  SESSION_PHASE_ADVANCED,
  INACTIVITY_TIMEOUT_EXCEEDED
} from '../actionTypes';
import { SESSION_PHASES } from 'owa/constants';
import { create_segmentId } from 'owa/models';

export default function firstSegmentPressed (state = false, action, sessionPhase) {
  switch (action.type) {
    case BUTTON_PRESSED:
      if (
        sessionPhase === SESSION_PHASES.QUEUE_TRANS_6
        && action.payload.levelId === 'level_6'
        && !state
      ) {
        return create_segmentId(
          action.payload.levelId,
          action.payload.segmentIndex
        )
      } else {
        return state;
      }

    case SESSION_PHASE_ADVANCED:
      switch (action.payload.phase) {
        case SESSION_PHASES.IDLE:
          return false;
        default:
          return state;
      }

    case INACTIVITY_TIMEOUT_EXCEEDED:
      return false;
    
    default:
      return state;
  }
}
