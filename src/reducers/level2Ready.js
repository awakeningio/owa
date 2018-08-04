/**
 *  @file       level2Ready.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { BUTTON_PRESSED } from '../actionTypes';
import { SESSION_PHASES } from '../constants';

export default function level2Ready (state = false, action, level4Sequencer, sessionPhase) {
  switch (action.type) {
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
