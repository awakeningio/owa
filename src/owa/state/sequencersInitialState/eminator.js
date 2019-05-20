import {
  create_owa_sequencer,
} from 'owa/models';
import { 
  SESSION_PHASES
} from 'owa/constants';

export default function createEminatorState () {
  const l6PlayQuant = [14, 0];
  const l6StopQuant = [14, 14];
  let sequencerList = [
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
        phaseProps: {
          [SESSION_PHASES.QUEUE_TRANS_6]: {
            bufName: 'eminator_trans_idle',
            attackTime: 0.0,
            releaseTime: 0.0,
            numBeats: 37 * 7,
            amp: 1.0
          },
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
    )
  ];
  sequencerList = sequencerList.map(seq => (
      {
        ...seq,
        ...seq.phaseProps[SESSION_PHASES.QUEUE_TRANS_6]
      }
  ));

  return sequencerList.reduce((acc, sequencer) => {
    acc[sequencer.sequencerId] = sequencer;
    return acc;
  }, {});
}
