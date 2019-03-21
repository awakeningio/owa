/**
 *  @file       index.js
 *
 *	@desc       Model instance data is defined here.
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2019 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import {
  create_simultaneous_level,
  create_sequential_level,
  create_segment
} from 'owa/models'
import createSequencersInitialState from './sequencersInitialState';
import songIdInitialState from './songIdInitialState';
import tempoInitialState from './tempoInitialState';
import sessionPhaseDurationsInitialState from './sessionPhaseDurationsInitialState';

export function createInitialState () {
  // create levels
  const levelsById = {
    'level_6': create_simultaneous_level('level_6', 6),
    'level_4': create_sequential_level('level_4', 4),
    'level_2': create_simultaneous_level('level_2', 2)
  };

  // create segments for each level
  const segmentsById = {};

  Object.keys(levelsById).forEach((levelId) => {
    const level = levelsById[levelId];

    let i;
    for (i = 0; i < level.numSegments; i++) {
      const newSegment = create_segment(level.levelId, i);
      segmentsById[newSegment.segmentId] = newSegment;
    }
  });

  return {
    levels: {
      byId: levelsById,
      allIds: Object.keys(levelsById)
    },
    segments: {
      byId: segmentsById,
      allIds: Object.keys(segmentsById)
    },
    sequencers: createSequencersInitialState(),
    songId: songIdInitialState,
    tempo: tempoInitialState,
    sessionPhaseDurations: sessionPhaseDurationsInitialState
  };
}
