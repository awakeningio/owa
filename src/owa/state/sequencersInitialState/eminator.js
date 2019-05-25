import {
  create_owa_sequencer,
  create_segmentId
} from 'owa/models';
import { 
  SESSION_PHASES
} from 'owa/constants';

const playingLevel4SegmentToBufName = {
  [create_segmentId('level_4', 0)]: 'eminator_chords_L4_01',
  [create_segmentId('level_4', 1)]: 'eminator_chords_L4_02',
  [create_segmentId('level_4', 2)]: 'eminator_chords_L4_03',
  [create_segmentId('level_4', 3)]: 'eminator_chords_L4_04'
};
const playingLevel2SegmentToBufName = {
  [create_segmentId('level_4', 0)]: 'eminator_chords_L2_01',
  [create_segmentId('level_4', 1)]: 'eminator_chords_L2_02',
  [create_segmentId('level_4', 2)]: 'eminator_chords_L2_03',
  [create_segmentId('level_4', 3)]: 'eminator_chords_L2_04'
};

export default function createEminatorState () {
  const l6PlayQuant = [14, 0];
  const l6StopQuant = [14, 14];
  const sequencerList = [
    create_owa_sequencer(
      'eminator-6_0',
      'EminatorBassSequencer',
      {
        phaseProps: {
          [SESSION_PHASES.QUEUE_TRANS_6]: {
            midiKey: 'eminator_bass_L6',
            numBeats: 4 * 7,
            playQuant: l6PlayQuant,
            stopQuant: l6StopQuant
          },
          [SESSION_PHASES.QUEUE_TRANS_4]: {
            midiKey: 'eminator_bass_L4',
            numBeats: 16 * 4,
            playQuant: [4, 4]
          },
          [SESSION_PHASES.QUEUE_TRANS_2]: {
            midiKey: 'eminator_bass_L2',
            numBeats: 2 * 4
          }
        }
      },
    ),
    create_owa_sequencer(
      'eminator-6_1',
      'EminatorCrazyVoicesSequencer',
      {
        phaseProps: {
          [SESSION_PHASES.QUEUE_TRANS_6]: {
            numBeats: 4 * 7,
            playQuant: l6PlayQuant,
            stopQuant: l6StopQuant
          }
        }
      }
    ),
    create_owa_sequencer(
      'eminator-6_2',
      'EminatorSharpEerieSequencer',
      {
        phaseProps: {
          [SESSION_PHASES.QUEUE_TRANS_6]: {
            numBeats: 2 * 7,
            playQuant: l6PlayQuant,
            stopQuant: l6StopQuant
          }
        }
      }
    ),
    create_owa_sequencer(
      'eminator-6_3',
      'EminatorNoisySFXSequencer',
      {
        phaseProps: {
          [SESSION_PHASES.QUEUE_TRANS_6]: {
            numBeats: 2 * 7,
            playQuant: l6PlayQuant,
            stopQuant: l6StopQuant
          }
        }
      }
    ),
    create_owa_sequencer(
      'eminator-6_4',
      'EminatorHatsEtcSequencer',
      {
        phaseProps: {
          [SESSION_PHASES.QUEUE_TRANS_6]: {
            numBeats: 2 * 7,
            playQuant: l6PlayQuant,
            stopQuant: l6StopQuant
          }
        }
      }
    ),
    create_owa_sequencer(
      'eminator-6_5',
      'EminatorKickSnareSequencer',
      {
        phaseProps: {
          [SESSION_PHASES.QUEUE_TRANS_6]: {
            numBeats: 2 * 7,
            playQuant: l6PlayQuant,
            stopQuant: l6StopQuant
          }
        }
      }
    ),
    create_owa_sequencer(
      'eminator-reveal',
      'OneShotSamplerSequencer',
      {
        bufNames: [
          "eminator_reveal"
        ],
        bufName: 'eminator_reveal',
        attackTime: 0.0,
        releaseTime: 0.0,
        numBeats: 98 * 4,
        amp: 1.0
      }
    ),
    create_owa_sequencer(
      'eminator-trans',
      'OneShotSamplerSequencer',
      {
        bufNames: [
          "eminator_trans_L2_reveal",
          "eminator_trans_L4_L2",
          "eminator_trans_L6_L4",
          "eminator_trans_idle",
        ],
        bufName: 'eminator_trans_idle',
        attackTime: 0.0,
        releaseTime: 0.0,
        //numBeats: 22 * 7,
        numBeats: 2 * 7,
        amp: 1.0,
        phaseProps: {
          [SESSION_PHASES.QUEUE_TRANS_4]: {
            bufName: 'eminator_trans_L6_L4',
            attackTime: 0.00,
            releaseTime: 0.00,
            numBeats: 8 * 4,
            amp: 1.0
          },
          [SESSION_PHASES.QUEUE_TRANS_2]: {
            bufName: 'eminator_trans_L4_L2',
            attackTime: 0.00,
            releaseTime: 0.00,
            numBeats: 8 * 4,
            amp: 1.0
          },
          [SESSION_PHASES.QUEUE_TRANS_ADVICE]: {
            bufName: 'eminator_trans_L2_reveal',
            attackTime: 0.00,
            releaseTime: 0.00,
            numBeats: 9 * 4,
            amp: 1.0
          }
        }
      }
    ),
    create_owa_sequencer(
      'eminator-level_4',
      'ChordProgSequencer',
      {
        numBeats: 4 * 4,
        playQuant: [4 * 4, 4],
        defaultPlayQuant: [4 * 4, 4],
        stopQuant: [4, 4],
        ampDb: -15.0,
        sustain: 4 * 4,
        bufNames: [
          'eminator_chords_L2_01',
          'eminator_chords_L2_02',
          'eminator_chords_L2_03',
          'eminator_chords_L2_04',
          'eminator_chords_L4_01',
          'eminator_chords_L4_02',
          'eminator_chords_L4_03',
          'eminator_chords_L4_04'
        ],
        bufSequence: [
          'eminator_chords_L4_01'
        ],
        phaseProps: {
          [SESSION_PHASES.QUEUE_TRANS_2]: {
            bufSequence: [
              'eminator_chords_L2_01',
              'eminator_chords_L2_02',
              'eminator_chords_L2_03',
              'eminator_chords_L2_04'
            ],
            segmentIdToBufName: playingLevel2SegmentToBufName
          },
          [SESSION_PHASES.QUEUE_TRANS_4]: {
            segmentIdToBufName: playingLevel4SegmentToBufName
          }
        }
      }
    ),
    create_owa_sequencer(
      'eminator-2_0',
      'EminatorWhispPopSequencer',
      {
        //phaseProps: {
          ////[SESSION_PHASES.QUEUE_TRANS_6]: {
            ////numBeats: 2 * 7,
            ////playQuant: l6PlayQuant,
            ////stopQuant: l6StopQuant
          ////}
        //}
      }
    ),
    create_owa_sequencer (
      'eminator-2_1',
      'EminatorLeadSequencer',
      {}
    ),
  ];
  //sequencerList = sequencerList.map(seq => {
    //return (
      //{
        //...seq,
        //...seq.phaseProps[SESSION_PHASES.QUEUE_TRANS_6]
      //}
  //)});

  return sequencerList.reduce((acc, sequencer) => {
    acc[sequencer.sequencerId] = sequencer;
    return acc;
  }, {});
}
