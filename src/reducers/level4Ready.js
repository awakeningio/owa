/**
 *  @file       level4Ready.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import _ from 'lodash';

import awakeningSequencers from 'awakening-sequencers';
import { SESSION_PHASES } from '../constants';
import { INACTIVITY_TIMEOUT_EXCEEDED } from '../actionTypes';

const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

export default function level4Ready (state = false, action, level6Sequencers, sessionPhase) {
  switch (action.type) {
    case INACTIVITY_TIMEOUT_EXCEEDED:
      return false;
    case awakeningSequencers.actionTypes.SEQUENCER_PLAYING:
      
      // a sequencer just started playing.
      if (sessionPhase === SESSION_PHASES.PLAYING_6) {
        // we are in playing_6

        let allLevel6SequencersPlaying = _.every(
          level6Sequencers,
          ['playingState', PLAYING_STATES.PLAYING]
        );

        return allLevel6SequencersPlaying;
      } else {
        // we aren't on PLAYING_6, so level4 is not ready.
        return false;
      }
    
    default:
      return state;
  }
}
