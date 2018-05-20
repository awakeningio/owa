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

import {
  create_simultaneous_level,
  create_sequential_level,
  create_segment,
  create_segmentId
} from './models'

import logger from './logging'

import abletonlinkRedux from 'abletonlink-redux'
import rootReducer from './reducers'
import awakeningSequencers from 'awakening-sequencers';
const create_default_sequencer = awakeningSequencers.create_default_sequencer;

const middleware = [
];

if (process.env.NODE_ENV === 'development') {
  /**
   *  logging of state-store messages
   **/
  middleware.push(createLogger({
    stateTransformer: () => {
      let toPrint = {};
      //toPrint.sequencers = {
        //'6_0': state.sequencers['6_0'],
        //'6_1': state.sequencers['6_1']
      //};
      //toPrint.levels = state.levels;
      return JSON.stringify(toPrint, ' ', 4);
    },
      logger: {
        log: (msg) => {
          logger.info(msg);
        }
      }
  }));
}

export function configureStore (additionalInitialState = {}) {
  let createStoreWithMiddleware = applyMiddleware(
    ...middleware
  )(createStore);

  // create levels
  let levelsById = {
    //'level_10': create_level('level_10', 3),
    //'level_8': create_level('level_8', 8),
    'level_6': create_simultaneous_level('level_6', 6),
    'level_4': create_sequential_level('level_4', 4),
    'level_2': create_simultaneous_level('level_2', 2)
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
    '6_0': create_default_sequencer('6_0', 'BassSequencer'),
    '6_1': create_default_sequencer('6_1', 'KickSequencer'),
    '6_2': create_default_sequencer('6_2', 'LazersSequencer'),
    '6_3': create_default_sequencer('6_3', 'LazersSequencer'),
    '6_4': create_default_sequencer('6_4', 'LazersSequencer'),
    '6_5': create_default_sequencer('6_5', 'LazersSequencer'),
    '4_0': create_default_sequencer('4_0', 'ChordProgSequencer'),
    '4_1': create_default_sequencer('4_1', 'ChordProgSequencer'),
    '4_2': create_default_sequencer('4_2', 'ChordProgSequencer'),
    '4_3': create_default_sequencer('4_3', 'ChordProgSequencer'),
    '2_0': create_default_sequencer('2_0', 'SimpleSequencer'),
    '2_1': create_default_sequencer('2_1', 'SimpleSequencer')
  };

  sequencers['2_0'].numBeats = 8;
  sequencers['2_0'].releaseTime = 1.2;
  sequencers['2_0'].pbind = {
    degree: [8, 4, 4, 8, 4, 4],
    octave: 2
  };
  sequencers['2_1'].numBeats = 8;
  sequencers['2_1'].releaseTime = 1.2;
  sequencers['2_1'].pbind = {
    degree: [8, 4, 4, 8, 4, 4],
    octave: 3
  };
  sequencers['4_0'].numBeats = 12;
  sequencers['4_0'].releaseTime = 1.2;
  sequencers['4_0'].pbind = {
    degree: [8, 4, 4, 8, 4, 4, 8, 4, 4, 8, 4, 4],
    octave: 2
  };
  sequencers['4_1'].numBeats = 12;
  sequencers['4_1'].releaseTime = 1.2;
  sequencers['4_1'].pbind = {
    degree: [8, 4, 4, 8, 4, 4, 8, 4, 4, 8, 4, 4],
    octave: 3
  };
  sequencers['4_2'].numBeats = 12;
  sequencers['4_2'].releaseTime = 1.2;
  sequencers['4_2'].pbind = {
    degree: [8, 4, 4, 8, 4, 4, 8, 4, 4, 8, 4, 4],
    octave: 4
  };
  sequencers['4_3'].numBeats = 12;
  sequencers['4_3'].releaseTime = 1.2;
  sequencers['4_3'].pbind = {
    degree: [8, 4, 4, 8, 4, 4, 8, 4, 4, 8, 4, 4],
    octave: 5
  };

  sequencers['6_0'].numBeats = 8;

  sequencers['6_1'].numBeats = 8;
  
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
    octave: 5
  };
  sequencers['6_3'].numBeats = 12;
  sequencers['6_3'].releaseTime = 1.2;
  sequencers['6_3'].pbind = {
    degree: [8, 4, 4, 8, 4, 4, 8, 4, 4, 8, 4, 4],
    octave: 6
  };
  sequencers['6_4'].numBeats = 12;
  sequencers['6_4'].releaseTime = 1.2;
  sequencers['6_4'].pbind = {
    degree: [8, 4, 4, 8, 4, 4, 8, 4, 4, 8, 4, 4],
    octave: 7
  };
  sequencers['6_5'].numBeats = 12;

  segmentsById[create_segmentId('level_6', 0)].sequencerId = '6_0';
  segmentsById[create_segmentId('level_6', 1)].sequencerId = '6_1';
  segmentsById[create_segmentId('level_6', 2)].sequencerId = '6_2';
  segmentsById[create_segmentId('level_6', 3)].sequencerId = '6_3';
  segmentsById[create_segmentId('level_6', 4)].sequencerId = '6_4';
  segmentsById[create_segmentId('level_6', 5)].sequencerId = '6_5';
  segmentsById[create_segmentId('level_4', 0)].sequencerId = '4_0';
  segmentsById[create_segmentId('level_4', 1)].sequencerId = '4_1';
  segmentsById[create_segmentId('level_4', 2)].sequencerId = '4_2';
  segmentsById[create_segmentId('level_4', 3)].sequencerId = '4_3';
  segmentsById[create_segmentId('level_2', 0)].sequencerId = '2_0';
  segmentsById[create_segmentId('level_2', 1)].sequencerId = '2_1';

  let initialState = Object.assign({}, {
    levels: {
      byId: levelsById,
      allIds: Object.keys(levelsById)
    },
    segments: {
      byId: segmentsById,
      allIds: Object.keys(segmentsById)
    },
    sequencers
  }, additionalInitialState);

  return createStoreWithMiddleware(rootReducer, initialState);
}

export function configureLinkStore () {
  let rootReducer = combineReducers({
    abletonlink: abletonlinkRedux.reducer
  });
  let middleware = [];
  //if (process.env.NODE_ENV === 'development') {
    //middleware.push(createLogger());
  //}
  return createStore(rootReducer, applyMiddleware(...middleware));
}
