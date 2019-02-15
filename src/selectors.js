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

import { create_segmentId } from 'owa/models';

const getTempo = state => state.tempo;
const getSessionPhase = state => state.sessionPhase;
const getSequencers = state => state.sequencers;
const getSessionPhaseDurations = state => state.sessionPhaseDurations;
const getRevealReady = state => state.revealReady;
const getIdlePlayer = state => state.idlePlayer;

export const getLevel4Sequencer = createSelector(
  getSequencers,
  (sequencers) => {
    return sequencers['level_4'];
  }
);


//const getSegments = state => state.segments;

const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
);
const segmentIdsByLevelId = {
  'level_6': [],
  'level_4': [],
  'level_2': []
};
var i;
for (i = 0; i < 6; i++) {
  segmentIdsByLevelId['level_6'].push(create_segmentId('level_6', i));
}

for (i = 0; i < 4; i++) {
  segmentIdsByLevelId['level_4'].push(create_segmentId('level_4', i));
}

for (i = 0; i < 2; i++) {
  segmentIdsByLevelId['level_2'].push(create_segmentId('level_2', i));
}
export function getSegmentIdsForLevel (levelId) {
  return segmentIdsByLevelId[levelId];
}

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
    const level6SequencerIds = ['6_0', '6_1', '6_2', '6_3', '6_4', '6_5'];
    const level6SequencersById = _.pick(sequencers, level6SequencerIds);
    return _.values(level6SequencersById);
  }
);

export const getLevel2Sequencers = createSelector(
  getSequencers,
  function (sequencers) {
    const level2SequencerIds = ['2_0', '2_1'];
    const level2SequencersById = _.pick(sequencers, level2SequencerIds);
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
