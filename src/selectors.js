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
)

export const getSCState = createDeepEqualSelector(
  getTempo,
  getSessionPhase,
  awakeningSequencers.selectors.getSCSequencers,
  (tempo, sessionPhase, sequencers) => ({
    tempo,
    sessionPhase,
    sequencers
  })
);
