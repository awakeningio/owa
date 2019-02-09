/**
 *  @file       revealReady.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import _ from 'lodash';

import awakeningSequencers from 'awakening-sequencers';

import { SESSION_PHASES } from 'owa/constants';
import { SESSION_PHASE_ADVANCED, INACTIVITY_TIMEOUT_EXCEEDED } from '../actionTypes';

const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

export default function revealReady (state = false, action, level2Sequencers, sessionPhase) {
  switch (action.type) {
    case INACTIVITY_TIMEOUT_EXCEEDED:
      return false;
    case awakeningSequencers.actionTypes.SEQUENCER_PLAYING:
    case SESSION_PHASE_ADVANCED:
      return (
        sessionPhase === SESSION_PHASES.PLAYING_2
        && _.every(
          level2Sequencers,
          ['playingState', PLAYING_STATES.PLAYING]
        )
      );
    
    default:
      return state;
  }
}
