/**
 *  @file       configureStore.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/


import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'

import { create_level, create_segment, create_segmentId } from './models'
import abletonlinkRedux from 'abletonlink-redux'
import rootReducer from './reducers'
import awakeningSequencers from 'awakening-sequencers';
const create_default_sequencer = awakeningSequencers.create_default_sequencer;

/**
 *  logging of state-store messages
 **/
const logger = createLogger({
  stateTransformer: (state) => {
    return JSON.stringify(state, ' ', 4);
  }
});
const middleware = [
];

if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

export function configureStore () {
  let createStoreWithMiddleware = applyMiddleware(
    ...middleware
  )(createStore);

  // create levels
  let levelsById = {
    //'level_10': create_level('level_10', 3),
    //'level_8': create_level('level_8', 8),
    'level_6': create_level('level_6', 6),
    'level_4': create_level('level_4', 4),
    'level_2': create_level('level_2', 2)
  };

  // create segments for each level
  let segmentsById = {};

  Object.keys(levelsById).forEach((levelId) => {
    let level = levelsById[levelId];

    let i;
    for (i = 0; i < level.numSegments; i++) {
      let newSegment = create_segment(level.levelId, i);
      segmentsById[newSegment.segmentId] = newSegment;
    }
  });

  let sequencers = {
    '6_0': create_default_sequencer('6_0', 'SimpleSequencer'),
    '6_1': create_default_sequencer('6_1', 'SimpleSequencer'),
    '6_2': create_default_sequencer('6_2', 'SimpleSequencer'),
    '6_3': create_default_sequencer('6_3', 'SimpleSequencer'),
    '6_4': create_default_sequencer('6_4', 'SimpleSequencer'),
    '6_5': create_default_sequencer('6_5', 'SimpleSequencer'),
  };
  sequencers['6_0'].numBeats = 12;
  sequencers['6_0'].releaseTime = 1.2;
  sequencers['6_0'].pbind = {
    degree: [8, 4, 4, 8, 4, 4, 8, 4, 4, 8, 4, 4],
    octave: 4
  };
  sequencers['6_1'].numBeats = 12;
  sequencers['6_1'].releaseTime = 1.2;
  sequencers['6_1'].pbind = {
    degree: [8, 4, 4, 8, 4, 4, 8, 4, 4, 8, 4, 4],
    octave: 4
  };
  sequencers['6_2'].numBeats = 12;
  sequencers['6_2'].releaseTime = 1.2;
  sequencers['6_2'].pbind = {
    degree: [8, 4, 4, 8, 4, 4, 8, 4, 4, 8, 4, 4],
    octave: 4
  };
  sequencers['6_3'].numBeats = 12;
  sequencers['6_3'].releaseTime = 1.2;
  sequencers['6_3'].pbind = {
    degree: [8, 4, 4, 8, 4, 4, 8, 4, 4, 8, 4, 4],
    octave: 4
  };
  sequencers['6_4'].numBeats = 12;
  sequencers['6_4'].releaseTime = 1.2;
  sequencers['6_4'].pbind = {
    degree: [8, 4, 4, 8, 4, 4, 8, 4, 4, 8, 4, 4],
    octave: 4
  };
  sequencers['6_5'].numBeats = 12;
  sequencers['6_5'].releaseTime = 1.2;
  sequencers['6_5'].pbind = {
    degree: [8, 4, 4, 8, 4, 4, 8, 4, 4, 8, 4, 4],
    octave: 4
  };

  segmentsById[create_segmentId('level_6', 0)].sequencerId = '6_0';
  segmentsById[create_segmentId('level_6', 1)].sequencerId = '6_1';
  segmentsById[create_segmentId('level_6', 2)].sequencerId = '6_2';
  segmentsById[create_segmentId('level_6', 3)].sequencerId = '6_3';
  segmentsById[create_segmentId('level_6', 4)].sequencerId = '6_4';
  segmentsById[create_segmentId('level_6', 5)].sequencerId = '6_5';

  let initialState = {
    levels: {
      byId: levelsById,
      allIds: Object.keys(levelsById)
    },
    segments: {
      byId: segmentsById,
      allIds: Object.keys(segmentsById)
    },
    sequencers
  };

  return createStoreWithMiddleware(rootReducer, initialState);
}

export function configureLinkStore () {
  let rootReducer = combineReducers({
    abletonlink: abletonlinkRedux.reducer
  });
  return createStore(rootReducer);
}
