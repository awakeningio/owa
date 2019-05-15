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
          [SESSION_PHASES.PLAYING_6]: {
            midiKey: 'eminator_bass_L6',
            numBeats: 4 * 7,
            playQuant: l6PlayQuant,
            stopQuant: l6StopQuant
          },
          [SESSION_PHASES.PLAYING_4]: {
            midiKey: 'eminator_bass_L4',
            numBeats: 16 * 4,
            playQuant: [4, 4]
          },
          [SESSION_PHASES.PLAYING_2]: {
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
          [SESSION_PHASES.PLAYING_6]: {
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
          [SESSION_PHASES.PLAYING_6]: {
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
          [SESSION_PHASES.PLAYING_6]: {
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
          [SESSION_PHASES.PLAYING_6]: {
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
          [SESSION_PHASES.PLAYING_6]: {
            numBeats: 2 * 7,
            playQuant: l6PlayQuant,
            stopQuant: l6StopQuant
          }
        }
      }
    )
  ];
  sequencerList = sequencerList.map(seq => (
      {
        ...seq,
        ...seq.phaseProps[SESSION_PHASES.PLAYING_6]
      }
  ));

  return sequencerList.reduce((acc, sequencer) => {
    acc[sequencer.sequencerId] = sequencer;
    return acc;
  }, {});
}
