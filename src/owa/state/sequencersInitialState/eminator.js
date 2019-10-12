import { create_owa_sequencer, create_segmentId } from "owa/models";
import { SESSION_PHASES, VARIATION_MENU_TYPES } from "owa/constants";

const playingLevel4SegmentToBufName = {
  [create_segmentId("level_4", 0)]: "eminator_chords_L4_01",
  [create_segmentId("level_4", 1)]: "eminator_chords_L4_02",
  [create_segmentId("level_4", 2)]: "eminator_chords_L4_03",
  [create_segmentId("level_4", 3)]: "eminator_chords_L4_04"
};
const playingLevel2SegmentToBufName = {
  [create_segmentId("level_4", 0)]: "eminator_chords_L2_01",
  [create_segmentId("level_4", 1)]: "eminator_chords_L2_02",
  [create_segmentId("level_4", 2)]: "eminator_chords_L2_03",
  [create_segmentId("level_4", 3)]: "eminator_chords_L2_04"
};

export default function createEminatorState(additionalInitialState) {
  const sessionPhaseDefaults = {
    [SESSION_PHASES.TRANS_6]: {
      playQuant: [14, 0],
      stopQuant: [14, 14],
      propQuant: [14, 0]
    },
    [SESSION_PHASES.TRANS_4]: {
      playQuant: [4, 0],
      propQuant: [4, 0]
    }
  };

  const sequencerList = [
    create_owa_sequencer(
      "eminator-6_0",
      "EminatorBassSequencer",
      {
        phaseProps: {
          [SESSION_PHASES.TRANS_6]: {
            ...sessionPhaseDefaults[SESSION_PHASES.TRANS_6],
            midiKey: "eminator_bass_L6",
            numBeats: 4 * 7,
            variationProps: [
              {
                midiKey: "eminator_bass_L6"
              },
              {
                midiKey: "eminator_bass_L6_01"
              },
              {
                midiKey: "eminator_bass_L6_02"
              },
              {
                midiKey: "eminator_bass_L6_03"
              }
            ],
            variationMenuType: VARIATION_MENU_TYPES.SECTIONS
          },
          [SESSION_PHASES.TRANS_4]: {
            ...sessionPhaseDefaults[SESSION_PHASES.TRANS_4],
            midiKey: "eminator_bass_L4",
            numBeats: 16 * 4,
            stopQuant: [4, 16 * 4],
            variationMenuType: VARIATION_MENU_TYPES.NONE
          },
          [SESSION_PHASES.TRANS_2]: {
            midiKey: "eminator_bass_L2",
            numBeats: 2 * 4,
            variationMenuType: VARIATION_MENU_TYPES.NONE
          }
        }
      },
      additionalInitialState
    ),
    create_owa_sequencer(
      "eminator-6_1",
      "EminatorCrazyVoicesSequencer",
      {
        phaseProps: {
          [SESSION_PHASES.TRANS_6]: {
            ...sessionPhaseDefaults[SESSION_PHASES.TRANS_6],
            numBeats: 4 * 7,
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
        },
      },
      additionalInitialState
    ),
    create_owa_sequencer(
      "eminator-6_2",
      "EminatorSharpEerieSequencer",
      {
        phaseProps: {
          [SESSION_PHASES.TRANS_6]: {
            ...sessionPhaseDefaults[SESSION_PHASES.TRANS_6],
            variationIndex: 0,
            numBeats: 2 * 7,
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
            ...sessionPhaseDefaults[SESSION_PHASES.TRANS_4],
            variationMenuType: VARIATION_MENU_TYPES.NONE
          }
        }
      },
      additionalInitialState
    ),
    create_owa_sequencer(
      "eminator-6_3",
      "EminatorNoisySFXSequencer",
      {
        phaseProps: {
          [SESSION_PHASES.TRANS_6]: {
            ...sessionPhaseDefaults[SESSION_PHASES.TRANS_6],
            numBeats: 2 * 7
          },
          [SESSION_PHASES.TRANS_4]: {
            ...sessionPhaseDefaults[SESSION_PHASES.TRANS_4],
            variationMenuType: VARIATION_MENU_TYPES.NONE
          }
        }
      },
      additionalInitialState
    ),
    create_owa_sequencer(
      "eminator-6_4",
      "EminatorHatsEtcSequencer",
      {
        phaseProps: {
          [SESSION_PHASES.TRANS_6]: {
            ...sessionPhaseDefaults[SESSION_PHASES.TRANS_6],
            numBeats: 2 * 7
          },
          [SESSION_PHASES.TRANS_4]: {
            ...sessionPhaseDefaults[SESSION_PHASES.TRANS_4],
            variationMenuType: VARIATION_MENU_TYPES.NONE
          }
        }
      },
      additionalInitialState
    ),
    create_owa_sequencer(
      "eminator-6_5",
      "EminatorKickSnareSequencer",
      {
        phaseProps: {
          [SESSION_PHASES.TRANS_6]: {
            ...sessionPhaseDefaults[SESSION_PHASES.TRANS_6],
            numBeats: 2 * 7
          },
          [SESSION_PHASES.TRANS_4]: {
            ...sessionPhaseDefaults[SESSION_PHASES.TRANS_4],
            variationMenuType: VARIATION_MENU_TYPES.NONE
          }
        }
      },
      additionalInitialState
    ),
    create_owa_sequencer(
      "eminator-reveal",
      "OneShotSamplerSequencer",
      {
        bufNames: ["eminator_reveal"],
        bufName: "eminator_reveal",
        attackTime: 0.0,
        releaseTime: 0.0,
        numBeats: 112 * 4,
        amp: 1.0
      },
      additionalInitialState
    ),
    create_owa_sequencer(
      "eminator-trans",
      "OneShotSamplerSequencer",
      {
        bufNames: [
          "eminator_trans_L2_reveal",
          "eminator_trans_L4_L2",
          "eminator_trans_L6_L4",
          "eminator_trans_idle"
        ],
        bufName: "eminator_trans_idle",
        attackTime: 0.0,
        releaseTime: 0.0,
        numBeats: 22 * 7,
        //numBeats: 2 * 7,
        amp: 1.0,
        phaseProps: {
          [SESSION_PHASES.QUEUE_TRANS_6]: {
            bufName: "eminator_trans_idle",
            attackTime: 0.0,
            releaseTime: 0.0,
            numBeats: 22 * 7,
            //numBeats: 2 * 7,
            amp: 1.0
          },
          [SESSION_PHASES.QUEUE_TRANS_4]: {
            bufName: "eminator_trans_L6_L4",
            attackTime: 0.0,
            releaseTime: 0.0,
            numBeats: 8 * 4,
            amp: 1.0
          },
          [SESSION_PHASES.QUEUE_TRANS_2]: {
            bufName: "eminator_trans_L4_L2",
            attackTime: 0.0,
            releaseTime: 0.0,
            numBeats: 8 * 4,
            amp: 1.0
          },
          [SESSION_PHASES.QUEUE_TRANS_ADVICE]: {
            bufName: "eminator_trans_L2_reveal",
            attackTime: 0.0,
            releaseTime: 0.0,
            numBeats: 9 * 4,
            amp: 1.0
          }
        }
      },
      additionalInitialState
    ),
    create_owa_sequencer(
      "eminator-level_4",
      "ChordProgSequencer",
      {
        numBeats: 4 * 4,
        playQuant: [4 * 4, 0],
        defaultPlayQuant: [4 * 4, 0],
        stopQuant: [4, 4],
        ampDb: -15.0,
        sustain: 4 * 4,
        bufNames: [
          "eminator_chords_L2_01",
          "eminator_chords_L2_02",
          "eminator_chords_L2_03",
          "eminator_chords_L2_04",
          "eminator_chords_L4_01",
          "eminator_chords_L4_02",
          "eminator_chords_L4_03",
          "eminator_chords_L4_04"
        ],
        bufSequence: ["eminator_chords_L4_01"],
        phaseProps: {
          [SESSION_PHASES.QUEUE_TRANS_2]: {
            segmentIdToBufName: playingLevel2SegmentToBufName
          },
          [SESSION_PHASES.TRANS_2]: {
            bufSequence: [
              "eminator_chords_L2_01",
              "eminator_chords_L2_02",
              "eminator_chords_L2_03",
              "eminator_chords_L2_04"
            ]
          },
          [SESSION_PHASES.QUEUE_TRANS_4]: {
            segmentIdToBufName: playingLevel4SegmentToBufName
          }
        }
      },
      additionalInitialState
    ),
    create_owa_sequencer(
      "eminator-2_0",
      "EminatorWhispPopSequencer",
      {
        playQuant: [16, 0]
        //phaseProps: {
        ////[SESSION_PHASES.TRANS_6]: {
        ////numBeats: 2 * 7,
        ////playQuant: l6PlayQuant,
        ////stopQuant: l6StopQuant
        ////}
        //}
      },
      additionalInitialState
    ),
    create_owa_sequencer(
      "eminator-2_1",
      "EminatorLeadSequencer",
      {
        playQuant: [16, 0]
      },
      additionalInitialState
    )
  ];

  console.log("sequencerList");
  console.log(sequencerList);

  return sequencerList.reduce((acc, sequencer) => {
    acc[sequencer.sequencerId] = sequencer;
    return acc;
  }, {});
}
