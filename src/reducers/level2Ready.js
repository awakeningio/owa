/**
 *  @file       level2Ready.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { BUTTON_PRESSED, INACTIVITY_TIMEOUT_EXCEEDED } from '../actionTypes';
import { SESSION_PHASES } from 'owa/constants';
import awakeningSequencers from 'awakening-sequencers';

// TODO: this should be a selector
export default function level2Ready (state = false, action, level4Sequencer, sessionPhase) {
  switch (action.type) {
    case INACTIVITY_TIMEOUT_EXCEEDED:
      return false;
    case awakeningSequencers.actionTypes.SESSION_PHASE_ADVANCED:
    case BUTTON_PRESSED:
      if (sessionPhase === SESSION_PHASES.PLAYING_4) {
        // we are in level 4 playback

        let allLevel4SegmentsTouched = (
          level4Sequencer.bufSequence.length === 4
        );
        return allLevel4SegmentsTouched;
      } else {
        // only if we are on PLAYING_4
        return false;
      }
    
    default:
      return state;
  }
}
