import awakeningSequencers from 'awakening-sequencers';

export function create_owa_sequencer (sequencerId, type, defaults = {}) {
  return {
    ...awakeningSequencers.create_default_sequencer(sequencerId, type),
    phaseProps: {},
    ...defaults
  };
}

export function apply_phase_props (sequencer, sessionPhase) {
  let newSequencer = sequencer;
  if (sequencer.phaseProps.hasOwnProperty(sessionPhase)) {
    newSequencer = {
      ...newSequencer,
      ...newSequencer.phaseProps[sessionPhase]
    };
  }
  return newSequencer;
}
