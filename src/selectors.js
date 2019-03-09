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
import every from 'lodash/every';

import awakeningSequencers from 'awakening-sequencers'

import { create_segmentId } from 'owa/models';
import { SESSION_PHASES } from 'owa/constants';

const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

const getTempo = state => state.tempo;
const getSessionPhase = state => state.sessionPhase;
const getSequencers = state => state.sequencers;
const getSegmentsById = state => state.segments.byId;
const getSessionPhaseDurations = state => state.sessionPhaseDurations;
const getIdlePlayer = state => state.idlePlayer;

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

const createGetLevelSegmentsSelector = function (levelId) {
  return createSelector(
    getSegmentsById,
    function (segmentsById) {
      return getSegmentIdsForLevel(levelId).map(
        segmentId => segmentsById[segmentId]
      );
    }
  );
}

export const getLevel6Segments = createGetLevelSegmentsSelector('level_6');
export const getLevel4Segments = createGetLevelSegmentsSelector('level_4');
export const getLevel2Segments = createGetLevelSegmentsSelector('level_2');

export const getLevel6Sequencers = createSelector(
  getLevel6Segments,
  getSequencers,
  function (level6Segments, sequencers) {
    return level6Segments.map(
      segment => sequencers[segment.sequencerId]
    );
  }
);

export const getLevel4Sequencer = createSelector(
  getLevel4Segments,
  getSequencers,
  (level4Segments, sequencers) => {
    return sequencers[level4Segments[0].sequencerId];
  }
);

export const getLevel2Sequencers = createSelector(
  getLevel2Segments,
  getSequencers,
  function (level2Segments, sequencers) {
    return level2Segments.map(
      segment => sequencers[segment.sequencerId]
    );
  }
);

export const getSegmentIdToBufName = createSelector(
  getLevel4Sequencer,
  getSessionPhase,
  function (level4Sequencer, sessionPhase) {
    return level4Sequencer.phaseProps[sessionPhase].segmentIdToBufName;
  }
);

export const getLevel4Ready = createSelector(
  getLevel6Sequencers,
  getSessionPhase,
  function (level6Sequencers, sessionPhase) {
    if (sessionPhase === SESSION_PHASES.PLAYING_6) {
      // Returns true if all level 6 sequencers are playing.
      return every(
        level6Sequencers,
        ['playingState', PLAYING_STATES.PLAYING]
      );
    } else {
      // we aren't on PLAYING_6, so level 4 cannot be ready.
      return false;
    }
  }
);

export const getLevel2Ready = createSelector(
  getLevel4Sequencer,
  getSessionPhase,
  function (level4Sequencer, sessionPhase) {
    if (sessionPhase === SESSION_PHASES.PLAYING_4) {
      // Checks to see if all level 4 segments were touched, i.e. the full
      // chord progression is playing.
      return level4Sequencer.bufSequence.length === 4;
    } else {
      // Level 2 can only be ready if we are on PLAYING_4
      return false;
    }
  }
);

export const getRevealReady = createSelector(
  getLevel2Sequencers,
  getSessionPhase,
  function (level2Sequencers, sessionPhase) {
    return (
      sessionPhase === SESSION_PHASES.PLAYING_2
      && every(
        level2Sequencers,
        ['playingState', PLAYING_STATES.PLAYING]
      )
    );
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
