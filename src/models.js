import { SESSION_PHASES } from './constants'
export function create_level (levelId, numSegments) {
  return {
    levelId,
    segmentPlaybackOrder: [],
    numSegments,
    segmentPlaybackIndex: false,
    activeSegmentId: false
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
