import awakeningSequencers from "awakening-sequencers"

import { createSpinnyPluckState } from './spinny_pluck';

export default function createSequencersInitialState () {
  return {
    ...createSpinnyPluckState()
  }; 
}
