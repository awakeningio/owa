import awakeningSequencers from 'awakening-sequencers';

import { createPhaseEndQuant } from 'owa/models';
import {
  VARIATION_MENU_TYPES,
  VARIATION_INTERACTION_STATES
} from 'owa/constants';
const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

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

export function create_owa_sequencer (sequencerId, type, defaults = {}, additionalInitialState) {
  let sequencer = {
    ...awakeningSequencers.create_default_sequencer(sequencerId, type),
    queueOnPhaseStart: false,
    phaseProps: {},
    variationProps: [],
    currentVariationIndex: 0,
    variationMenuType: VARIATION_MENU_TYPES.NONE,
    variationInteractionState: VARIATION_INTERACTION_STATES.NONE,
    lastButtonPressTime: 0,
    ...defaults,
  };
  if (additionalInitialState && additionalInitialState.hasOwnProperty('sessionPhase')) {
    const { sessionPhase, songId } = additionalInitialState;
    sequencer = apply_phase_props(sequencer, sessionPhase);
    sequencer = do_queue_on_phase_start(sequencer, sessionPhase, songId);
  }
  return sequencer;
}

