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

import { getLevel6Sequencers } from '../selectors';

import soundReady from './soundReady';
import sequencers from './sequencers';
import levels from './levels';
import sessionPhase from './sessionPhase';
import segments from './segments';
import fadecandyConnection from './fadecandyConnection';
import tempo from './tempo';
import level4Ready from './level4Ready';
import level2Ready from './level2Ready';
import sessionPhaseDurations from './sessionPhaseDurations';

var combined = combineReducers({
  tempo,
  fadecandyConnection,
  soundReady,
  segments,
  sessionPhaseDurations
});

var prevSessionPhase;
export default function (state, action) {
  let newState,
    newLevels,
    newSequencers,
    newLevel4Ready,
    newLevel2Ready,
    newSessionPhase;
  prevSessionPhase = state.sessionPhase;
  newState = combined(state, action);
  if (state !== newState) {
    state = Object.assign({}, state, newState);
  }
  newSessionPhase = sessionPhase(state.sessionPhase, action, state.level4Ready);
  if (newSessionPhase !== state.sessionPhase) {
    state = Object.assign({}, state, {sessionPhase: newSessionPhase});
  }
  newLevels = levels(state.levels, action, state.segments);
  if (newLevels !== state.levels) {
    state = Object.assign({}, state, {levels: newLevels});
  }
  newSequencers = sequencers(
    state.sequencers,
    action,
    state.segments,
    state.levels,
    state.sessionPhase,
    prevSessionPhase,
    state.sessionPhaseDurations
  );
  if (newSequencers !== state.sequencers) {
    state = Object.assign({}, state, {sequencers: newSequencers});
  }
  newLevel4Ready = level4Ready(
    state.level4Ready,
    action,
    getLevel6Sequencers(state),
    state.sessionPhase
  );
  if (newLevel4Ready !== state.level4Ready) {
    state = Object.assign({}, state, {level4Ready: newLevel4Ready});
  }
  newLevel2Ready = level2Ready(
    state.level2Ready,
    action,
    state.sequencers.level_4,
    state.sessionPhase
  );
  if (newLevel2Ready !== state.level2Ready) {
    state = Object.assign({}, state, {level2Ready: newLevel2Ready});
  }
  return state;
}
