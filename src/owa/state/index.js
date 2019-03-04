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
  create_segment,
  create_segmentId,
} from 'owa/models'

import { createSpinnyPluckState } from './spinny_pluck';

export function createInitialState () {
  const spinnyPluck = createSpinnyPluckState();

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

  segmentsById[create_segmentId('level_6', 0)].sequencerId = 'spinny_pluck-6_0';
  segmentsById[create_segmentId('level_6', 1)].sequencerId = 'spinny_pluck-6_1';
  segmentsById[create_segmentId('level_6', 2)].sequencerId = 'spinny_pluck-6_2';
  segmentsById[create_segmentId('level_6', 3)].sequencerId = 'spinny_pluck-6_3';
  segmentsById[create_segmentId('level_6', 4)].sequencerId = 'spinny_pluck-6_4';
  segmentsById[create_segmentId('level_6', 5)].sequencerId = 'spinny_pluck-6_5';
  segmentsById[create_segmentId('level_4', 0)].sequencerId = 'spinny_pluck-level_4';
  segmentsById[create_segmentId('level_4', 1)].sequencerId = 'spinny_pluck-level_4';
  segmentsById[create_segmentId('level_4', 2)].sequencerId = 'spinny_pluck-level_4';
  segmentsById[create_segmentId('level_4', 3)].sequencerId = 'spinny_pluck-level_4';
  segmentsById[create_segmentId('level_2', 0)].sequencerId = 'spinny_pluck-2_0';
  segmentsById[create_segmentId('level_2', 1)].sequencerId = 'spinny_pluck-2_1';

  return {
    levels: {
      byId: levelsById,
      allIds: Object.keys(levelsById)
    },
    segments: {
      byId: segmentsById,
      allIds: Object.keys(segmentsById)
    },
    ...spinnyPluck
  };
}
