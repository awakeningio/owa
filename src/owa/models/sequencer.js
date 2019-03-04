import awakeningSequencers from 'awakening-sequencers';

import { createPhaseProps } from './sessionPhase';

export function create_owa_sequencer (sequencerId, type, defaults = {}) {
  return {
    ...awakeningSequencers.create_default_sequencer(sequencerId, type),
    ...defaults,
    ...{
      phaseProps: createPhaseProps(defaults.phaseProps)
    }
  };
}


