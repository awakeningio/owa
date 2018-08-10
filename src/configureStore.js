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
import _ from 'lodash';

import {
  create_simultaneous_level,
  create_sequential_level,
  create_segment,
  create_segmentId,
  create_owa_sequencer
} from './models'

import { SESSION_PHASES } from './constants';

import logger from './logging'

import abletonlinkRedux from 'abletonlink-redux'
import rootReducer from './reducers'
const middleware = [
];

if (process.env.NODE_ENV === 'development') {
  /**
   *  logging of state-store messages
   **/
  const stateTransformer = function (state) {
    let toPrint = {};
    toPrint.sequencers = state.sequencers;
    //Object.keys(state.sequencers).forEach(function (seqId) {
      //toPrint.sequencers[seqId] = _.pick(state.sequencers[seqId], [
        //'type',
        //'playingState',
        //'playQuant',
        //'stopQuant',
        //'event',
        //'bufSequence'
      //])
    //});
    toPrint.level4Ready = state.level4Ready;
    toPrint.level2Ready = state.level2Ready;
    toPrint.revealReady = state.revealReady;
    toPrint.sessionPhase = state.sessionPhase;
    toPrint.sessionPhaseDurations = state.sessionPhaseDurations;
    return toPrint;
  };
  const storeLogger = store => next => action => {
    logger.info(JSON.stringify(action));
    let result = next(action);
    logger.info(JSON.stringify(stateTransformer(store.getState()), ' ', 4));
    return result;
  };
  middleware.push(storeLogger);
}

export default function configureStore (additionalInitialState = {}) {
  let createStoreWithMiddleware = applyMiddleware(
    ...middleware
  )(createStore);

  // create levels
  let levelsById = {
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
    '6_0': create_owa_sequencer('6_0', 'BassSequencer'),
    '6_1': create_owa_sequencer('6_1', 'KickSequencer'),
    '6_2': create_owa_sequencer('6_2', 'HiHatSequencer'),
    '6_3': create_owa_sequencer('6_3', 'LeadPopSequencer'),
    '6_4': create_owa_sequencer('6_4', 'ChimeSequencer'),
    '6_5': create_owa_sequencer('6_5', 'SfxSequencer'),
    //'4_0': create_owa_sequencer('4_0', 'ChordProgSequencer'),
    //'4_1': create_owa_sequencer('4_1', 'ChordProgSequencer'),
    //'4_2': create_owa_sequencer('4_2', 'ChordProgSequencer'),
    //'4_3': create_owa_sequencer('4_3', 'ChordProgSequencer'),
    'level_4': create_owa_sequencer('level_4', 'ChordProgSequencer'),
    '2_0': create_owa_sequencer('2_0', 'KalimbaSequencer'),
    '2_1': create_owa_sequencer('2_1', 'OrganicPercSequencer')
  };

  sequencers['6_2'].midiName = 'spinny-pluck_L6_hats';
  sequencers['6_2'].phaseProps[SESSION_PHASES.PLAYING_2] = {
    midiName: 'spinny-pluck_L2_hats'
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
  let numBeats = 8;
  sequencers.level_4.numBeats = numBeats;
  sequencers.level_4.playQuant = [8, 1];
  sequencers.level_4.defaultPlayQuant = [8, 1];
  sequencers.level_4.stopQuant = [numBeats, numBeats];
  sequencers.level_4.bufNames = [
    'spinny-pluck_L4_chords-1',
    'spinny-pluck_L4_chords-2',
    'spinny-pluck_L4_chords-3',
    'spinny-pluck_L4_chords-4',
    'spinny-pluck_L2_chords-1',
    'spinny-pluck_L2_chords-2',
    'spinny-pluck_L2_chords-3',
    'spinny-pluck_L2_chords-4',
  ];
  sequencers.level_4.bufSequence = [
    'spinny-pluck_L4_chords-1'
  ];
  sequencers.level_4.phaseProps[SESSION_PHASES.PLAYING_2] = {
    bufSequence: [
      'spinny-pluck_L2_chords-1',
      'spinny-pluck_L2_chords-2',
      'spinny-pluck_L2_chords-3',
      'spinny-pluck_L2_chords-4',
    ]
  };

  //['4_0', '4_1', '4_2', '4_3'].forEach(function (seqId) {
    //let numBeats = 8;
    //sequencers[seqId].numBeats = numBeats;
    //sequencers[seqId].playQuant = [8, 1];
    //sequencers[seqId].stopQuant = [numBeats, numBeats];
  //});
  //sequencers['4_0'].bufName = 'spinny-pluck_L4_chords-1';
  //sequencers['4_1'].bufName = 'spinny-pluck_L4_chords-2';
  //sequencers['4_2'].bufName = 'spinny-pluck_L4_chords-3';
  //sequencers['4_3'].bufName = 'spinny-pluck_L4_chords-4';

  sequencers['6_0'].numBeats = 2 * 4;
  sequencers['6_1'].numBeats = 2 * 4;
  sequencers['6_2'].numBeats = 8 * 4;
  sequencers['6_3'].numBeats = 4 * 4;
  sequencers['6_4'].numBeats = 2 * 4;
  sequencers['6_5'].playQuant = [4, 1];
  sequencers['6_5'].numBeats = 8 * 4;

  // TODO: set sequencer 6 playQuant and stopQuant

  segmentsById[create_segmentId('level_6', 0)].sequencerId = '6_0';
  segmentsById[create_segmentId('level_6', 1)].sequencerId = '6_1';
  segmentsById[create_segmentId('level_6', 2)].sequencerId = '6_2';
  segmentsById[create_segmentId('level_6', 3)].sequencerId = '6_3';
  segmentsById[create_segmentId('level_6', 4)].sequencerId = '6_4';
  segmentsById[create_segmentId('level_6', 5)].sequencerId = '6_5';

  let segment = segmentsById[create_segmentId('level_4', 0)];
  segment.sequencerId = 'level_4';
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_4].bufName = 'spinny-pluck_L4_chords-1';
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_2].bufName = 'spinny-pluck_L2_chords-1';
  segment = segmentsById[create_segmentId('level_4', 1)];
  segment.sequencerId = 'level_4';
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_4].bufName = 'spinny-pluck_L4_chords-2';
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_2].bufName = 'spinny-pluck_L2_chords-2';
  segment = segmentsById[create_segmentId('level_4', 2)];
  segment.sequencerId = 'level_4';
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_4].bufName = 'spinny-pluck_L4_chords-3';
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_2].bufName = 'spinny-pluck_L2_chords-3';
  segment = segmentsById[create_segmentId('level_4', 3)];
  segment.sequencerId = 'level_4';
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_4].bufName = 'spinny-pluck_L4_chords-4';
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_2].bufName = 'spinny-pluck_L2_chords-4';

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
