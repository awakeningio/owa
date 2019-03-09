import awakeningSequencers from "awakening-sequencers"
const create_default_sequencer = awakeningSequencers.create_default_sequencer;
export const baseRevealSequencer = create_default_sequencer(
  'reveal',
  'SamplerSequencer'
);

baseRevealSequencer.bufNames = [
  'spinny-pluck_reveal'
];

export const baseTransitionSequencer = create_default_sequencer(
  'trans',
  'SamplerSequencer'
);

baseTransitionSequencer.bufNames = [
  'spinny-pluck_idle-L6',
  'spinny-pluck_L6-L4',
  'spinny-pluck_L4-L2',
  'spinny-pluck_L2-reveal'
];

