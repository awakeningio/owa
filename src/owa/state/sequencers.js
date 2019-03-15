import awakeningSequencers from "awakening-sequencers"
const create_default_sequencer = awakeningSequencers.create_default_sequencer;
export const baseRevealSequencer = create_default_sequencer(
  'reveal',
  'SamplerSequencer'
);

baseRevealSequencer.bufNames = [
  'spinny-pluck_reveal'
];
