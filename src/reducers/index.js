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

import { getLevel6Sequencers, getLevel2Sequencers } from '../selectors';

import soundReady from './soundReady';
import sequencers from './sequencers';
import levels from './levels';
import sessionPhase from './sessionPhase';
import segments from './segments';
import fadecandyConnection from './fadecandyConnection';
import tempo from './tempo';
import level4Ready from './level4Ready';
import level2Ready from './level2Ready';
import revealReady from './revealReady';
import sessionPhaseDurations from './sessionPhaseDurations';
import idlePlayer from './idlePlayer';
import inactivityTimeoutStartTime from './inactivityTimeoutStartTime';
import firstSegmentPressed from './firstSegmentPressed';

var combined = combineReducers({
  tempo,
  fadecandyConnection,
  soundReady,
  sessionPhaseDurations,
  inactivityTimeoutStartTime
});

export default function (state, action) {
  const prevSessionPhase = state.sessionPhase;
  const newState = combined(state, action);
  if (state !== newState) {
    state = Object.assign({}, state, newState);
  }
  const newSessionPhase = sessionPhase(
    state.sessionPhase,
    action,
    state.level4Ready,
    state.level2Ready
  );
  if (newSessionPhase !== state.sessionPhase) {
    state = Object.assign({}, state, {sessionPhase: newSessionPhase});
  }
  const newSegments = segments(
    state.segments,
    action
  );
  if (newSegments !== state.segments) {
    state = Object.assign({}, state, { segments: newSegments });
  }
  const newLevels = levels(state.levels, action, state.segments);
  if (newLevels !== state.levels) {
    state = Object.assign({}, state, {levels: newLevels});
  }
  const newSequencers = sequencers(
    state.sequencers,
    action,
    state,
    prevSessionPhase
  );
  if (newSequencers !== state.sequencers) {
    state = Object.assign({}, state, {sequencers: newSequencers});
  }
  const newIdlePlayer = idlePlayer(
    state.idlePlayer,
    action,
    state.sessionPhase,
    prevSessionPhase
  );
  if (newIdlePlayer !== state.idlePlayer) {
    state = Object.assign({}, state, {idlePlayer: newIdlePlayer});
  }
  const newLevel4Ready = level4Ready(
    state.level4Ready,
    action,
    getLevel6Sequencers(state),
    state.sessionPhase
  );
  if (newLevel4Ready !== state.level4Ready) {
    state = Object.assign({}, state, {level4Ready: newLevel4Ready});
  }
  const newLevel2Ready = level2Ready(
    state.level2Ready,
    action,
    state
  );
  if (newLevel2Ready !== state.level2Ready) {
    state = Object.assign({}, state, {level2Ready: newLevel2Ready});
  }
  const newRevealReady = revealReady(
    state.revealReady,
    action,
    getLevel2Sequencers(state),
    state.sessionPhase
  );
  if (newRevealReady !== state.revealReady) {
    state = Object.assign({}, state, { revealReady: newRevealReady });
  }
  const newFirstSegmentPressed = firstSegmentPressed(
    state.firstSegmentPressed,
    action,
    state.sessionPhase
  );
  if (newFirstSegmentPressed !== state.firstSegmentPressed) {
    state = Object.assign(
      {},
      state,
      { firstSegmentPressed: newFirstSegmentPressed }
    );
  }
  return state;
}
