import { createSpinnyPluckState } from './spinny_pluck';
import createEminatorState from './eminator';

export default function createSequencersInitialState () {
  return {
    ...createSpinnyPluckState(),
    ...createEminatorState()
  }; 
}
