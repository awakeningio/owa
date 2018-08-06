import {
  SESSION_PHASES,
  NEXT_SESSION_PHASES,
  LEVEL_PLAYBACK_TYPE
} from './constants'
import awakeningSequencers from 'awakening-sequencers';
const create_default_sequencer = awakeningSequencers.create_default_sequencer;
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

export function create_segmentId (levelId, segmentIndex) {
  return `${levelId}-segment_${segmentIndex}`;
}

export function create_segment (levelId, segmentIndex) {
  let segment = {
    segmentId: create_segmentId(levelId, segmentIndex),
    sequencerId: false
  };
  return segment;
}

export function get_playing_levelId_for_sessionPhase (sessionPhase) {
  return {
    [SESSION_PHASES.PLAYING_6]: 'level_6',
    [SESSION_PHASES.PLAYING_4]: 'level_4',
    [SESSION_PHASES.PLAYING_2]: 'level_2'
  }[sessionPhase] || null;
}

export function create_owa_sequencer (sequencerId, sequencerClass) {
  let seq = create_default_sequencer(sequencerId, sequencerClass);

  // automatically change these properties of the sequencer when the
  // sessionPhase changes.
  seq.level4Props = {};
  seq.level2Props = {};

  return seq;
}

export function createPhaseEndQuant (sessionPhase, sessionPhaseDurations) {
  return [
    4,
    1 + sessionPhaseDurations[sessionPhase]
  ];
}

export function createPhaseStartQuant (sessionPhase, sessionPhaseDurations) {
  return [
    4,
    sessionPhaseDurations[sessionPhase]
  ];
}

export function createNextPhaseEndQuant (sessionPhase, sessionPhaseDurations) {
  return [
    4,
    1 + sessionPhaseDurations[sessionPhase]
    + sessionPhaseDurations[
      NEXT_SESSION_PHASES[sessionPhase]
    ],
  ];
}

