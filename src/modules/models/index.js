import {
  SESSION_PHASES,
  NEXT_SESSION_PHASES,
} from 'owa/constants'
import awakeningSequencers from 'awakening-sequencers';
const create_default_sequencer = awakeningSequencers.create_default_sequencer;

export * from './level';

export function create_segmentId (levelId, segmentIndex) {
  return `${levelId}-segment_${segmentIndex}`;
}

function createPhaseProps () {
  return Object.keys(SESSION_PHASES).reduce(
    function (phaseProps, sessionPhase) {
      phaseProps[sessionPhase] = {};
      return phaseProps
    },
    {}
  );
}

export function create_segment (levelId, segmentIndex) {
  return {
    levelId,
    segmentIndex,
    segmentId: create_segmentId(levelId, segmentIndex),
    sequencerId: false,
    // when associating this segment with some properties of its seq
    sequencerProps: {},
    phaseSequencerProps: createPhaseProps(),
    lastButtonPressTime: 0
  };
}

export function get_playing_levelId_for_sessionPhase (sessionPhase) {
  return {
    [SESSION_PHASES.PLAYING_6]: 'level_6',
    [SESSION_PHASES.PLAYING_4]: 'level_4',
    [SESSION_PHASES.PLAYING_2]: 'level_2'
  }[sessionPhase] || null;
}

export function create_owa_sequencer (sequencerId, type) {
  return {
    ...create_default_sequencer(sequencerId, type),
    ...{
      // automatically change these properties of the sequencer when the
      // sessionPhase changes.
      phaseProps: createPhaseProps()
    }
  };
}

export function createPhaseEndQuant (sessionPhase, sessionPhaseDurations) {
  return [
    4,
    sessionPhaseDurations[sessionPhase]
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
    4 + sessionPhaseDurations[
      NEXT_SESSION_PHASES[sessionPhase]
    ],
  ];
}
