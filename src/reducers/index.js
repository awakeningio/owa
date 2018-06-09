/**
 *  @file       index.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/
import { combineReducers } from 'redux';

import soundReady from './soundReady';
import sequencers from './sequencers';
import levels from './levels';
import sessionPhase from './sessionPhase';
import segments from './segments';
import fadecandyConnection from './fadecandyConnection';
import tempo from './tempo';

var combined = combineReducers({
  tempo,
  fadecandyConnection,
  soundReady,
  sessionPhase,
  segments
});

var prevSessionPhase;
export default function (state, action) {
  let newState,
    newLevels,
    newSequencers;
  prevSessionPhase = state.sessionPhase;
  newState = combined(state, action);
  if (state !== newState) {
    state = Object.assign({}, state, newState);
  }
  newLevels = levels(state.levels, action, state.segments);
  if (newLevels !== state.levels) {
    state = Object.assign({}, state, {levels: newLevels});
  }
  newSequencers = sequencers(state.sequencers, action, state.segments, state.levels, state.sessionPhase, prevSessionPhase);
  if (newSequencers !== state.sequencers) {
    state = Object.assign({}, state, {sequencers: newSequencers});
  }
  return state;
}
