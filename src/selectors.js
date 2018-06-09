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

const getSequencers = state => state.sequencers;
const getTempo = state => state.tempo;
const getSessionPhase = state => state.sessionPhase;

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
);

const getSCReplicaSequencers = createSelector(
  getSequencers,
  (sequencers) => {
    var simplifiedSequencers = {};
    Object.keys(sequencers).forEach((sequencerId) => {
      simplifiedSequencers[sequencerId] = Object.assign(
        {},
        sequencers[sequencerId]
      );
      delete simplifiedSequencers[sequencerId].event;
      delete simplifiedSequencers[sequencerId].nextBeat;
      delete simplifiedSequencers[sequencerId].beat;
    });
    return simplifiedSequencers;
  }
);

export const getSCReplicaState = createDeepEqualSelector(
  getTempo,
  getSessionPhase,
  getSCReplicaSequencers,
  (tempo, sessionPhase, sequencers) => ({
    tempo,
    sessionPhase,
    sequencers
  })
);
