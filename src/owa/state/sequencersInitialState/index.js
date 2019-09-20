import { createSpinnyPluckState } from './spinny_pluck';
import createEminatorState from './eminator';

export default function createSequencersInitialState (additionalInitialState) {
  return {
    ...createSpinnyPluckState(additionalInitialState),
    ...createEminatorState(additionalInitialState)
  }; 
}
