/**
 *  @file       levels.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { SESSION_PHASES } from '../constants';
import * as actionTypes from '../actionTypes';

import { PLAYING_STATES } from 'awakening-sequencers';


function create_default_segment (numSegments, segmentIndex) {
  let segment = {
    sequencerId: `level_${numSegments}-segment_${segmentIndex}`
  };
  return segment;
}

function create_default_level (numSegments, segmentMeterQuant, beatDur, segmentDuration) {
  let level = {
    numSegments,
    segments: [],
    segmentMeterQuant,
    beatDur,
    segmentDuration,
    activeSegmentIndex: false,
    playingState: PLAYING_STATES.STOPPED
  };
  let i = 0;
  for (i = 0; i < numSegments; i++) {
    level.segments.push(create_default_segment(numSegments, i));
  }

  return level;

}

function create_default_state () {
  let levels = {
    'level_10': create_default_level(10, 5, 1, 1),
    'level_8': create_default_level(8),
    'level_6': create_default_level(6),
    'level_4': create_default_level(4),
    'level_2': create_default_level(2)
  };

  return levels;
}

export default function levels (state = create_default_state(), action) {
  switch (action.type) {
    case actionTypes.SESSION_PHASE_ADVANCED:
      switch (action.payload.phase) {
        case SESSION_PHASES.PLAYING_10:
          state.level_10.playingState = PLAYING_STATES.PLAYING;
          state.level_10.activeSegmentIndex = 0;
          break;

        case SESSION_PHASES.PLAYING_8:
          state.level_8.playingState = PLAYING_STATES.PLAYING;
          state.level_8.activeSegmentIndex = 0;
          break;

        case SESSION_PHASES.PLAYING_6:
          state.level_6.playingState = PLAYING_STATES.PLAYING;
          state.level_6.activeSegmentIndex = 0;
          break;

        case SESSION_PHASES.PLAYING_4:
          state.level_4.playingState = PLAYING_STATES.PLAYING;
          state.level_4.activeSegmentIndex = 0;
          break;
        
        default:
          break;
      }
      break;
    
    default:
      break;
  }
  return state;
}
