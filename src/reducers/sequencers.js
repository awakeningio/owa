import awakeningSequencers from "awakening-sequencers"

function create_initial_state () {
  let initialState = {
    'level_10-segment_0': awakeningSequencers.create_default_sequencer(
      'level_10-segment_0',
      'simple'
    ),
    'level_10-segment_1': awakeningSequencers.create_default_sequencer(
      'level_10-segment_1',
      'simple'
    ),
    'level_10-segment_2': awakeningSequencers.create_default_sequencer(
      'level_10-segment_2',
      'simple'
    )
  };
  initialState['level_10-segment_0'].numBeats = 10;
  initialState['level_10-segment_0'].releaseTime = 1.2;
  initialState['level_10-segment_0'].pbind = {
    degree: [8, 4, 4, 4, 4, 8, 4, 4, 4, 4],
    octave: 4
  };
  initialState['level_10-segment_1'].numBeats = 10;
  initialState['level_10-segment_1'].releaseTime = 0.2;
  initialState['level_10-segment_1'].pbind = {
    degree: [8, 4, 4, 4, 4, 8, 4, 4, 4, 4],
    octave: 6
  };
  initialState['level_10-segment_2'].numBeats = 10;
  initialState['level_10-segment_2'].releaseTime = 0.2;
  initialState['level_10-segment_2'].pbind = {
    degree: [8, 4, 4, 4, 4, 8, 4, 4, 4, 4],
    octave: 8
  };
  return initialState;
}

export default function sequencers (state = create_initial_state(), action) {
  return awakeningSequencers.reducer(state, action);
}
