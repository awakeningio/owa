import {
  SESSION_PHASES,
  NEXT_SESSION_PHASES,
  LEVEL_PLAYBACK_TYPE
} from '../constants'
/**
 *  a sequential level is one that plays it's segments in sequence.
 **/
export function create_sequential_level (levelId, numSegments) {
  return {
    playbackType: LEVEL_PLAYBACK_TYPE.SEQUENTIAL,
    levelId,
    //segmentPlaybackOrder: [],
    numSegments,
    //segmentPlaybackIndex: false,
    //activeSegmentId: false
  };
}
/**
 *  A simultaneous level plays all its sequencers simultaneously.
 **/
export function create_simultaneous_level (levelId, numSegments) {
  return {
    playbackType: LEVEL_PLAYBACK_TYPE.SIMULTANEOUS,
    levelId,
    numSegments
  };
}

