/**
 *  @file       idlePlayer.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import SCReduxSequencers from 'supercollider-redux-sequencers';

import {
  OWA_SOUND_INIT_DONE,
  SESSION_PHASE_ADVANCED,
  INACTIVITY_TIMEOUT_EXCEEDED
} from '../actionTypes';
import { SESSION_PHASES } from 'owa/constants';
import { createIdlePlayer } from 'owa/models';

const PLAYING_STATES = SCReduxSequencers.PLAYING_STATES;

export default function idlePlayer (state = createIdlePlayer(), action) {
  switch (action.type) {
    case INACTIVITY_TIMEOUT_EXCEEDED:
      return Object.assign({}, state, {
        playingState: PLAYING_STATES.PLAYING,
        gate: 1
      });
    case OWA_SOUND_INIT_DONE:
      return Object.assign({}, state, {
        playingState: PLAYING_STATES.PLAYING,
        gate: 1
      });
    case SESSION_PHASE_ADVANCED:
      // we may need to queue a transition now
      switch (action.payload.phase) {
        case SESSION_PHASES.TRANS_6:
          return {
            ...state,
            gate: 0
          };

        case SESSION_PHASES.PLAYING_6:
          return {
            ...state,
            playingState: PLAYING_STATES.STOPPED
          };

        case SESSION_PHASES.IDLE:
          return Object.assign({}, state, {
            playingState: PLAYING_STATES.PLAYING,
            gate: 1
          });

        default:
          return state;
      }
    default:
      return state;
  }
}
