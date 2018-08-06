/**
 *  @file       selectors.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';

import awakeningSequencers from 'awakening-sequencers'

const getTempo = state => state.tempo;
const getSessionPhase = state => state.sessionPhase;
const getSequencers = state => state.sequencers;
const getSessionPhaseDurations = state => state.sessionPhaseDurations;
const getRevealReady = state => state.revealReady;

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
);

export const getLevel6Sequencers = createSelector(
  getSequencers,
  function (sequencers) {
    let level6SequencerIds = ['6_0', '6_1', '6_2', '6_3', '6_4', '6_5'];
    let level6SequencersById = _.pick(sequencers, level6SequencerIds);
    return _.values(level6SequencersById);
  }
);

export const getLevel4Sequencers = createSelector(
  getSequencers,
  function (sequencers) {
    let level4SequencerIds = ['4_0', '4_1', '4_2', '4_3'];
    let level4SequencersById = _.pick(sequencers, level4SequencerIds);
    return _.values(level4SequencersById);
  }
);

export const getLevel2Sequencers = createSelector(
  getSequencers,
  function (sequencers) {
    let level2SequencerIds = ['2_0', '2_1'];
    let level2SequencersById = _.pick(sequencers, level2SequencerIds);
    return _.values(level2SequencersById);
  }
);

export const getSCState = createDeepEqualSelector(
  getTempo,
  getSessionPhase,
  getSessionPhaseDurations,
  awakeningSequencers.selectors.getSCSequencers,
  getRevealReady,
  (tempo, sessionPhase, sessionPhaseDurations, sequencers, revealReady) => ({
    tempo,
    sessionPhase,
    sessionPhaseDurations,
    sequencers,
    revealReady
  })
);
