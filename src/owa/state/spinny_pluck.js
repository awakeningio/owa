import awakeningSequencers from 'awakening-sequencers'

import {
  create_owa_sequencer,
  create_segmentId,
} from 'owa/models'

import {
  baseRevealSequencer,
} from 'owa/state/sequencers'

import { SESSION_PHASES, SONG_IDS } from 'owa/constants'

export function createSpinnyPluckState () {
  const songId = SONG_IDS.SPINNY_PLUCK;
  const tempo = 120.0;
  const sessionPhaseDurations = {
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

  const playingLevel4SegmentToBufName = {
    [create_segmentId('level_4', 0)]: 'spinny-pluck_L4_chords-1',
    [create_segmentId('level_4', 1)]: 'spinny-pluck_L4_chords-2',
    [create_segmentId('level_4', 2)]: 'spinny-pluck_L4_chords-3',
    [create_segmentId('level_4', 3)]: 'spinny-pluck_L4_chords-4'
  };
  const playingLevel2SegmentToBufName = {
    [create_segmentId('level_4', 0)]: 'spinny-pluck_L2_chords-1',
    [create_segmentId('level_4', 1)]: 'spinny-pluck_L2_chords-2',
    [create_segmentId('level_4', 2)]: 'spinny-pluck_L2_chords-3',
    [create_segmentId('level_4', 3)]: 'spinny-pluck_L2_chords-4'
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
          ],
          segmentIdToBufName: playingLevel2SegmentToBufName
        },
        [SESSION_PHASES.PLAYING_4]: {
          segmentIdToBufName: playingLevel4SegmentToBufName
        },
        [SESSION_PHASES.QUEUE_TRANS_4]: {
          segmentIdToBufName: playingLevel4SegmentToBufName
        },
        [SESSION_PHASES.TRANS_4]: {
          segmentIdToBufName: playingLevel4SegmentToBufName
        }
      }
    }
  );

  sequencers['reveal'] = Object.assign(
    {},
    baseRevealSequencer,
    {
      bufName: 'spinny-pluck_reveal',
      attackTime: 0.0,
      releaseTime: 0.0,
      numBeats: 55 * 4,
      amp: 1.0
    }
  );

  sequencers['trans'] = create_owa_sequencer(
    'trans',
    'SamplerSequencer',
    {
      bufNames: [
        'spinny-pluck_idle-L6',
        'spinny-pluck_L6-L4',
        'spinny-pluck_L4-L2',
        'spinny-pluck_L2-reveal'
      ],
      phaseProps: {
        [SESSION_PHASES.QUEUE_TRANS_6]: {
          bufName: 'spinny-pluck_idle-L6',
          attackTime: 120.0/60.0 * 6,
          releaseTime: 4.0,
          numBeats: 15 * 4,
          amp: 1.5
        },
        [SESSION_PHASES.QUEUE_TRANS_4]: {
          bufName: 'spinny-pluck_L6-L4',
          attackTime: 0.01,
          releaseTime: 0.01,
          numBeats: 6 * 4,
          amp: 0.4
        },
        [SESSION_PHASES.QUEUE_TRANS_2]: {
          bufName: 'spinny-pluck_L4-L2',
          attackTime: 0.01,
          releaseTime: 0.01,
          numBeats: 5 * 4,
          amp: 0.3
        },
        [SESSION_PHASES.QUEUE_TRANS_ADVICE]: {
          bufName: 'spinny-pluck_L2-reveal',
          attackTime: 0.01,
          releaseTime: 0.01,
          numBeats: 7 * 4,
          amp: 0.5
        }
      }
    }
  );
  sequencers['trans'] = {
    ...sequencers['trans'],
    ...sequencers['trans'].phaseProps[SESSION_PHASES.QUEUE_TRANS_6]
  };


  return {
    songId,
    sequencers,
    tempo,
    sessionPhaseDurations
  };
}
