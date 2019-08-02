import awakeningSequencers from 'awakening-sequencers';

import { createPhaseEndQuant } from 'owa/models';
import { VARIATION_MENU_TYPES } from 'owa/constants';
const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

export function create_owa_sequencer (sequencerId, type, defaults = {}) {
  return {
    ...awakeningSequencers.create_default_sequencer(sequencerId, type),
    queueOnPhaseStart: false,
    phaseProps: {},
    variationProps: [],
    currentVariationIndex: 0,
    variationMenuType: VARIATION_MENU_TYPES.NONE,
    ...defaults,
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

export function do_queue_on_phase_start (sequencer, sessionPhase, songId) {
  let newSequencer = sequencer;
  if (
    newSequencer.queueOnPhaseStart
    && newSequencer.queueOnPhaseStart === sessionPhase
  ) {
    newSequencer = {
      ...newSequencer,
      playingState: PLAYING_STATES.QUEUED,
      playQuant: createPhaseEndQuant(sessionPhase, songId),
      queueOnPhaseStart: false
    };
  }
  return newSequencer;
}
