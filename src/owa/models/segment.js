export function create_segmentId (levelId, segmentIndex) {
  return `${levelId}-segment_${segmentIndex}`;
}

export function create_segment (levelId, segmentIndex) {
  return {
    levelId,
    segmentIndex,
    segmentId: create_segmentId(levelId, segmentIndex),
    lastButtonPressTime: 0
  };
}


