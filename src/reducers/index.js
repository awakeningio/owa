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
import sessionPhaseDurations from './sessionPhaseDurations';
import idlePlayer from './idlePlayer';
import inactivityTimeoutStartTime from './inactivityTimeoutStartTime';
import firstSegmentPressed from './firstSegmentPressed';
import songId from './songId';

var combined = combineReducers({
  songId,
  fadecandyConnection,
  soundReady,
  inactivityTimeoutStartTime
});

export default function (state, action) {
  const prevSessionPhase = state.sessionPhase;
  const newState = combined(state, action);
  if (state !== newState) {
    state = Object.assign({}, state, newState);
  }
  const newTempo = tempo(
    state.tempo,
    action,
    state
  );
  if (newTempo !== state.tempo) {
    state = {...state, ...{tempo: newTempo}};
  }
  const newSessionPhaseDurations = sessionPhaseDurations(
    state.sessionPhaseDurations,
    action,
    state
  );
  if (newSessionPhaseDurations !== state.sessionPhaseDurations) {
    state = {...state, ...{sessionPhaseDurations: newSessionPhaseDurations}};
  }
  const newSessionPhase = sessionPhase(
    state.sessionPhase,
    action,
    state
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
