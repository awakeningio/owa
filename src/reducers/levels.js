function create_default_segment (levelId, segmentIndex) {
  let segment = {
    sequencerId: `level_${levelId}-segment_${segmentIndex}`
  };
  return segment;
}

function create_default_level (id, segmentMeterQuant, beatDur, segmentDuration) {
  let level = {
    id,
    segments: [],
    segmentMeterQuant,
    beatDur,
    segmentDuration
  };

  let numSegments = id;
  let i = 0;
  for (i = 0; i < numSegments; i++) {
    level.segments.push(create_default_segment(id, i));
  }

  return level;

}

function create_default_state () {
  let levels = [
    create_default_level(10, 5, 1, 1),
    create_default_level(8),
    create_default_level(6),
    create_default_level(4),
    create_default_level(2)
  ];

  return levels;
}

export default function levels (state = create_default_state(), action) {
  return state;
}
