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
