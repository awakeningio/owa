import {
  create_owa_sequencer,
} from 'owa/models';
import { 
  SESSION_PHASES
} from 'owa/constants';

export default function createEminatorState () {
  const sequencerList = [];
  let eminatorBassSeq = create_owa_sequencer(
    'eminator-6_0',
    'EminatorBassSequencer',
    {
      phaseProps: {
        [SESSION_PHASES.PLAYING_6]: {
          midiKey: 'eminator_bass_L6',
          numBeats: 4 * 7,
          playQuant: [7, 7]
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
  );
  eminatorBassSeq = {
    ...eminatorBassSeq,
    ...eminatorBassSeq.phaseProps[SESSION_PHASES.PLAYING_6]
  };
  sequencerList.push(eminatorBassSeq);

  sequencerList.push(create_owa_sequencer(
    'eminator-6_1',
    'EminatorCrazyVoicesSequencer'
  ));

  sequencerList.push(create_owa_sequencer(
      'eminator-6_2',
      'EminatorSharpEerieSequencer'
  ));

  return sequencerList.reduce((acc, sequencer) => {
    acc[sequencer.sequencerId] = sequencer;
    return acc;
  }, {});
}
