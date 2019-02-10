import {
  SESSION_PHASES,
  NEXT_SESSION_PHASES,
} from 'owa/constants';
import { 
  createPhaseProps
} from './sessionPhase';

export function create_segmentId (levelId, segmentIndex) {
  return `${levelId}-segment_${segmentIndex}`;
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


