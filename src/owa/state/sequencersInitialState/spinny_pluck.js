import {
  create_owa_sequencer,
  create_segmentId,
} from 'owa/models'

import { SESSION_PHASES, VARIATION_MENU_TYPES } from 'owa/constants'

export function createSpinnyPluckState (additionalInitialState) {
  const sequencers = {
    'spinny_pluck-6_0': create_owa_sequencer('spinny_pluck-6_0', 'SpinnyBassSequencer', {
      numBeats: 2 * 4,
      playQuant: [4, 4],
      propQuant: [4, 0],
      phaseProps: {
        [SESSION_PHASES.TRANS_6]: {
          variationIndex: 0,
          variationProps: [
            {
              variationIndex: 0
            },
            {
              variationIndex: 1
            },
            {
              variationIndex: 2
            }
          ],
          variationMenuType: VARIATION_MENU_TYPES.SECTIONS
        },
        [SESSION_PHASES.TRANS_4]: {
          variationMenuType: VARIATION_MENU_TYPES.NONE
        }
      }
    }, additionalInitialState),
    'spinny_pluck-6_1': create_owa_sequencer('spinny_pluck-6_1', 'SpinnyKickSequencer', {
      numBeats: 2 * 4,
      playQuant: [4, 4],
      propQuant: [4, 0],
      phaseProps: {
        [SESSION_PHASES.TRANS_6]: {
          variationIndex: 0,
          variationProps: [
            {
              variationIndex: 0
            },
            {
              variationIndex: 1
            },
            {
              variationIndex: 2
            },
            {
              variationIndex: 3
            }
          ],
          variationMenuType: VARIATION_MENU_TYPES.SECTIONS
        },
        [SESSION_PHASES.TRANS_4]: {
          variationMenuType: VARIATION_MENU_TYPES.NONE
        }
      }
    }, additionalInitialState),
    'spinny_pluck-6_2': create_owa_sequencer('spinny_pluck-6_2', 'SpinnyHiHatSequencer', {
      numBeats: 8 * 4,
      playQuant: [4, 4],
      propQuant: [4, 0],
      phaseProps: {
        [SESSION_PHASES.TRANS_6]: {
          variationIndex: 0,
          variationProps: [
            {
              variationIndex: 0
            },
            {
              variationIndex: 1
            },
            {
              variationIndex: 2
            }
          ],
          variationMenuType: VARIATION_MENU_TYPES.SECTIONS
        },
        [SESSION_PHASES.TRANS_4]: {
          variationMenuType: VARIATION_MENU_TYPES.NONE
        }
      }
    }, additionalInitialState),
    'spinny_pluck-6_3': create_owa_sequencer('spinny_pluck-6_3', 'SpinnyLeadPopSequencer', {
      numBeats: 4 * 4,
      playQuant: [4, 4],
      propQuant: [4, 0],
      phaseProps: {
        [SESSION_PHASES.TRANS_6]: {
          variationIndex: 0,
          variationProps: [
            {
              variationIndex: 0
            },
            {
              variationIndex: 1
            },
            {
              variationIndex: 2
            }
          ],
          variationMenuType: VARIATION_MENU_TYPES.SECTIONS
        },
        [SESSION_PHASES.TRANS_4]: {
          variationMenuType: VARIATION_MENU_TYPES.NONE
        }
      }
    }, additionalInitialState),
    'spinny_pluck-6_4': create_owa_sequencer('spinny_pluck-6_4', 'SpinnyChimeSequencer', {
      numBeats: 2 * 4,
      playQuant: [4, 4],
      phaseProps: {
        [SESSION_PHASES.TRANS_6]: {
          variationIndex: 0,
          variationProps: [
            {
              variationIndex: 0
            },
            {
              variationIndex: 1
            },
            {
              variationIndex: 2
            },
            {
              variationIndex: 3
            }
          ],
          variationMenuType: VARIATION_MENU_TYPES.SECTIONS
        },
        [SESSION_PHASES.TRANS_4]: {
          variationMenuType: VARIATION_MENU_TYPES.NONE
        }
      }
    }, additionalInitialState),
    'spinny_pluck-6_5': create_owa_sequencer('spinny_pluck-6_5', 'SpinnySfxSequencer', {
      numBeats: 8 * 4,
      playQuant: [4, 4],
      stopQuant: [4, 4],
      propQuant: [4, 0],
    }, additionalInitialState),
    'spinny_pluck-2_0': create_owa_sequencer('spinny_pluck-2_0', 'SpinnyKalimbaSequencer', {
      numBeats: 8,
      releaseTime: 1.2,
      pbind: {
        degree: [8, 4, 4, 8, 4, 4],
        octave: 2
      }
    }, additionalInitialState),
    'spinny_pluck-2_1': create_owa_sequencer('spinny_pluck-2_1', 'SpinnyOrganicPercSequencer', {
      numBeats: 8,
      releaseTime: 1.2,
      pbind: {
        degree: [8, 4, 4, 8, 4, 4],
        octave: 3
      }
    }, additionalInitialState)
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
      ampDb: 8.0,
      sustain: numBeats + 2,
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
        [SESSION_PHASES.QUEUE_TRANS_2]: {
          segmentIdToBufName: playingLevel2SegmentToBufName
        },
        [SESSION_PHASES.TRANS_2]: {
          bufSequence: [
            'spinny-pluck_L2_chords-1',
            'spinny-pluck_L2_chords-2',
            'spinny-pluck_L2_chords-3',
            'spinny-pluck_L2_chords-4'
          ]
        },
        [SESSION_PHASES.QUEUE_TRANS_4]: {
          segmentIdToBufName: playingLevel4SegmentToBufName
        }
      }
      , additionalInitialState}
  );
  sequencers['spinny_pluck-reveal'] = create_owa_sequencer(
    'spinny_pluck-reveal',
    'OneShotSamplerSequencer',
    {
      bufNames: [
        'spinny-pluck_reveal'
      ],
      bufName: 'spinny-pluck_reveal',
      attackTime: 0.0,
      releaseTime: 0.0,
      numBeats: 55 * 4,
      amp: 1.0
    }
    , additionalInitialState);
  
  sequencers['spinny_pluck-trans'] = create_owa_sequencer(
    'spinny_pluck-trans',
    'OneShotSamplerSequencer',
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
    , additionalInitialState);
  sequencers['spinny_pluck-trans'] = {
    ...sequencers['spinny_pluck-trans'],
    ...sequencers['spinny_pluck-trans'].phaseProps[SESSION_PHASES.QUEUE_TRANS_6]
  };

  return sequencers;
}
