export function create_level (levelId, numSegments) {
  let segmentPlaybackOrder = [];
  let i;
  for (i = 0; i < numSegments; i++) {
    segmentPlaybackOrder.push(i);
  }
  return {
    levelId,
    segmentPlaybackOrder,
    numSegments,
    activeSegmentIndex: false,
    activeSegmentId: false
  };
}

function create_segmentId (levelId, segmentIndex) {
  return `${levelId}-segment_${segmentIndex}`;
}

export function create_segment (levelId, segmentIndex) {
  let segment = {
    segmentId: create_segmentId(levelId, segmentIndex),
    sequencerId: false
  };
  return segment;
}
