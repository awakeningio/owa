/**
 *  @file       idlePlayer.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import awakeningSequencers from 'awakening-sequencers';

import { OWA_SOUND_INIT_DONE, SESSION_PHASE_ADVANCED } from '../actionTypes';
import { SESSION_PHASES } from '../constants';

const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

const defaultIdlePlayer = {
  bufName: 'eerie_idle_loop',
  gate: 1,
  playingState: PLAYING_STATES.STOPPED
};

export default function idlePlayer (
  state = defaultIdlePlayer,
  action
) {
  switch (action.type) {
    case OWA_SOUND_INIT_DONE:
      return Object.assign({}, state, {
        playingState: PLAYING_STATES.PLAYING,
        gate: 1
      });
    case SESSION_PHASE_ADVANCED:
      // we may need to queue a transition now
      switch (action.payload.phase) {
        case SESSION_PHASES.TRANS_6:
          return Object.assign({}, state, {
            gate: 0
          });

        case SESSION_PHASES.IDLE:
          return Object.assign({}, state, {
            gate: 1
          });

        default:
          return state;
      }
    default:
      return state;
  }
}
