/**
 *  @file       selectors.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/
import { createSelectorCreator, defaultMemoize } from 'reselect';
import isEqual from 'lodash/isEqual';

import awakeningSequencers from 'awakening-sequencers'

const getTempo = state => state.tempo;
const getSessionPhase = state => state.sessionPhase;

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
);

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
