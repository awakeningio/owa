import awakeningSequencers from 'awakening-sequencers';

import { createPhaseProps } from './sessionPhase';

export function create_owa_sequencer (sequencerId, type) {
  return {
    ...awakeningSequencers.create_default_sequencer(sequencerId, type),
    ...{
      // automatically change these properties of the sequencer when the
      // sessionPhase changes.
      phaseProps: createPhaseProps()
    }
  };
}


