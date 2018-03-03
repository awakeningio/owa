/**
 *  @file       index.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import soundReady from './soundReady';
import sequencers from './sequencers';
import levels from './levels';
import sessionPhase from './sessionPhase';
import segments from './segments';

export default function (state, action) {
  state.soundReady = soundReady(state.soundReady, action);
  state.sessionPhase = sessionPhase(state.sessionPhase, action);
  state.levels = levels(state.levels, action);
  state.segments = segments(state.segments, action);
  state.sequencers = sequencers(state.sequencers, action, state.segments);
  return state;
}
