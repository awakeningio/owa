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
  create_owa_sequencer
} from 'owa/models'

import { SESSION_PHASES } from 'owa/constants';

const spinnyPluckSessionPhaseDurations = {
  [SESSION_PHASES.QUEUE_TRANS_6]: 4,
  [SESSION_PHASES.TRANS_6]: 15 * 4,
  [SESSION_PHASES.QUEUE_TRANS_4]: 4,
  [SESSION_PHASES.TRANS_4]: 4 * 4,
  [SESSION_PHASES.QUEUE_TRANS_2]: 4,
  [SESSION_PHASES.TRANS_2]: 4 * 4,
  [SESSION_PHASES.PLAYING_2]: 8,
  [SESSION_PHASES.QUEUE_TRANS_ADVICE]: 4,
  [SESSION_PHASES.TRANS_ADVICE]: 6 * 4,
  [SESSION_PHASES.PLAYING_ADVICE]: 55 * 4
};

export function createInitialState () {
  const sequencers = {
    'spinny_pluck-6_0': create_owa_sequencer('spinny_pluck-6_0', 'BassSequencer', {
      numBeats: 2 * 4,
      playQuant: [4, 4]
    }),
    'spinny_pluck-6_1': create_owa_sequencer('spinny_pluck-6_1', 'KickSequencer', {
      numBeats: 2 * 4,
      playQuant: [4, 4]
    }),
    'spinny_pluck-6_2': create_owa_sequencer('spinny_pluck-6_2', 'HiHatSequencer', {
      numBeats: 8 * 4,
      playQuant: [4, 4],
      midiName: 'spinny-pluck_L6_hats',
      phaseProps: {
        [SESSION_PHASES.PLAYING_2]: {
          midiName: 'spinny-pluck_L2_hats'
        }
      }
    }),
    'spinny_pluck-6_3': create_owa_sequencer('spinny_pluck-6_3', 'LeadPopSequencer', {
      numBeats: 4 * 4,
      playQuant: [4, 4]
    }),
    'spinny_pluck-6_4': create_owa_sequencer('spinny_pluck-6_4', 'ChimeSequencer', {
      numBeats: 2 * 4,
      playQuant: [4, 4]
    }),
    'spinny_pluck-6_5': create_owa_sequencer('spinny_pluck-6_5', 'SfxSequencer', {
      numBeats: 8 * 4,
      playQuant: [4, 4],
      stopQuant: [4, 4]
    }),
    //'4_0': create_owa_sequencer('4_0', 'ChordProgSequencer'),
    //'4_1': create_owa_sequencer('4_1', 'ChordProgSequencer'),
    //'4_2': create_owa_sequencer('4_2', 'ChordProgSequencer'),
    //'4_3': create_owa_sequencer('4_3', 'ChordProgSequencer'),
    'spinny_pluck-2_0': create_owa_sequencer('spinny_pluck-2_0', 'KalimbaSequencer', {
      numBeats: 8,
      releaseTime: 1.2,
      pbind: {
        degree: [8, 4, 4, 8, 4, 4],
        octave: 2
      }
    }),
    'spinny_pluck-2_1': create_owa_sequencer('spinny_pluck-2_1', 'OrganicPercSequencer', {
      numBeats: 8,
      releaseTime: 1.2,
      pbind: {
        degree: [8, 4, 4, 8, 4, 4],
        octave: 3
      }
    })
  };

  const numBeats = 8;
  sequencers['spinny_pluck-level_4'] = create_owa_sequencer(
    'spinny_pluck-level_4',
    'ChordProgSequencer',
    {
      numBeats: numBeats,
      playQuant: [8, 8],
      defaultPlayQuant: [8, 8],
      stopQuant: [numBeats, numBeats],
      bufNames: [
        'spinny-pluck_L4_chords-1',
        'spinny-pluck_L4_chords-2',
        'spinny-pluck_L4_chords-3',
        'spinny-pluck_L4_chords-4',
        'spinny-pluck_L2_chords-1',
        'spinny-pluck_L2_chords-2',
        'spinny-pluck_L2_chords-3',
        'spinny-pluck_L2_chords-4',
      ],
      bufSequence: [
        'spinny-pluck_L4_chords-1'
      ],
      phaseProps: {
        [SESSION_PHASES.PLAYING_2]: {
          bufSequence: [
            'spinny-pluck_L2_chords-1',
            'spinny-pluck_L2_chords-2',
            'spinny-pluck_L2_chords-3',
            'spinny-pluck_L2_chords-4'
          ]
        }
      }
    }
  );

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

  let segment = segmentsById[create_segmentId('level_4', 0)];
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_4].bufName = 'spinny-pluck_L4_chords-1';
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_2].bufName = 'spinny-pluck_L2_chords-1';

  segment = segmentsById[create_segmentId('level_4', 1)];
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_4].bufName = 'spinny-pluck_L4_chords-2';
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_2].bufName = 'spinny-pluck_L2_chords-2';

  segment = segmentsById[create_segmentId('level_4', 2)];
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_4].bufName = 'spinny-pluck_L4_chords-3';
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_2].bufName = 'spinny-pluck_L2_chords-3';

  segment = segmentsById[create_segmentId('level_4', 3)];
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_4].bufName = 'spinny-pluck_L4_chords-4';
  segment.phaseSequencerProps[SESSION_PHASES.PLAYING_2].bufName = 'spinny-pluck_L2_chords-4';

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
    tempo: 120.0,
    levels: {
      byId: levelsById,
      allIds: Object.keys(levelsById)
    },
    segments: {
      byId: segmentsById,
      allIds: Object.keys(segmentsById)
    },
    sequencers,
    sessionPhaseDurations: spinnyPluckSessionPhaseDurations
  };
}
