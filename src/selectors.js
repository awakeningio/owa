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
const getIdlePlayer = state => state.idlePlayer;

//const getSegments = state => state.segments;

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
);
//const level6SegmentIds = [];
//var i;
//for (i = 0; i < 6; i++) {
  //level6SegmentIds.push(create_segmentId('level_6', i));
//}

//const level4SegmentIds = [];
//for (i = 0; i < 4; i++) {
  //level4SegmentIds.push(create_segmentId('level_4', i));
//}

//const level2SegmentIds = [];
//for (i = 0; i < 2; i++) {
  //level2SegmentIds.push(create_segmentId('level_2', i));
//}

//export const getLevel6Segments = createSelector(
  //getSegments,
  //function (segments) {
    //let level6SegmentsById = _.pick(segments.byId, level6SegmentIds);
    //return _.values(level6SegmentsById);
  //}
//);

//export const getLevel4Segments = createSelector(
  //getSegments,
  //function (segments) {
    //let level4SegmentsById = _.pick(segments.byId, level4SegmentIds);
    //return _.values(level4SegmentsById);
  //}
//)

//export const getLevel2Segments = createSelector(
  //getSegments,
  //function (segments) {
    //let level2SegmentsById = _.pick(segments.byId, level2SegmentIds);
    //return _.values(level2SegmentsById);
  //}
//);

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
  getIdlePlayer,
  (tempo, sessionPhase, sessionPhaseDurations, sequencers, revealReady, idlePlayer) => ({
    tempo,
    sessionPhase,
    sessionPhaseDurations,
    sequencers,
    revealReady,
    idlePlayer
  })
);
