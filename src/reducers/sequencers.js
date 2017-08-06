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
    )
  };
  initialState['level_10-segment_0'].releaseTime = 1.2;
  initialState['level_10-segment_0'].pbind = {
    dur: [1, 1, 1, 1, 1, 'r5']
  };
  initialState['level_10-segment_1'].releaseTime = 0.2;
  initialState['level_10-segment_1'].pbind = {
    dur: ['r5', 1, 1, 1, 1, 1]
  };
  return initialState;
}

export default function sequencers (state = create_initial_state(), action) {
  return awakeningSequencers.reducer(state, action);
}
