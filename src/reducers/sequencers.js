/**
 *  @file       sequencers.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import awakeningSequencers from "awakening-sequencers"
import * as actionTypes from '../actionTypes'
import {
  create_segmentId,
  createPhaseEndQuant,
  createPhaseStartQuant,
  createNextPhaseEndQuant
} from '../models'
import { SESSION_PHASES } from '../constants'

const create_default_sequencer = awakeningSequencers.create_default_sequencer;
const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

const l6SequencerIds = ['6_0', '6_1', '6_2', '6_3', '6_4', '6_5'];

const baseRevealSequencer = create_default_sequencer(
  'reveal',
  'SamplerSequencer'
);

baseRevealSequencer.bufNames = [
  'spinny-pluck_reveal'
];

const spinnyPluckRevealSequencer = Object.assign(
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

function reveal (
  state = spinnyPluckRevealSequencer,
  action,
  sessionPhase,
  sessionPhaseDurations
) {
  switch (action.type) {
    case actionTypes.SESSION_PHASE_ADVANCED:
      if (action.payload.phase === SESSION_PHASES.TRANS_ADVICE) {
        return Object.assign({}, state, {
          playingState: PLAYING_STATES.QUEUED,
          playQuant: createPhaseEndQuant(
            action.payload.phase,
            sessionPhaseDurations
          )
        });
      }
      return state;
    
    default:
      return state;
  }
}

const baseTransitionSequencer = create_default_sequencer(
  'trans',
  'SamplerSequencer'
);

baseTransitionSequencer.bufNames = [
  'spinny-pluck_idle-L6',
  'spinny-pluck_L6-L4',
  'spinny-pluck_L4-L2',
  'spinny-pluck_L2-reveal'
];

const spinnyPluckIdleTransitionSequencer = Object.assign(
  {},
  baseTransitionSequencer,
  {
    bufName: 'spinny-pluck_idle-L6',
    attackTime: 120.0/60.0 * 6,
    releaseTime: 4.0,
    numBeats: 15 * 4,
    amp: 1.5
  }
);

const spinnyPluckL4TransitionSequencer = Object.assign(
  {},
  baseTransitionSequencer,
  {
    bufName: 'spinny-pluck_L6-L4',
    attackTime: 0.01,
    releaseTime: 0.01,
    numBeats: 5 * 4,
    amp: 1.0
  }
);

const spinnyPluckL2TransitionSequencer = Object.assign(
  {},
  baseTransitionSequencer,
  {
    bufName: 'spinny-pluck_L4-L2',
    attackTime: 0.01,
    releaseTime: 0.01,
    numBeats: 5 * 4,
    amp: 1.0
  }
);

const spinnyPluckRevealTransitionSequencer = Object.assign(
  {},
  baseTransitionSequencer,
  {
    bufName: 'spinny-pluck_L2-reveal',
    attackTime: 0.01,
    releaseTime: 0.01,
    numBeats: 7 * 4,
    amp: 1.0
  }
);

function trans (
  state = spinnyPluckIdleTransitionSequencer,
  action,
  sessionPhase,
  prevSessionPhase,
  sessionPhaseDurations
) {
  switch (action.type) {
    case actionTypes.BUTTON_PRESSED:
      // if this button pressed triggered a sessionPhase change
      if (prevSessionPhase !== sessionPhase) {
        let playQuant = createPhaseEndQuant(
          sessionPhase,
          sessionPhaseDurations
        );
        // we may need to queue a transition
        switch (sessionPhase) {
          case SESSION_PHASES.QUEUE_TRANS_6:
            return Object.assign({}, spinnyPluckIdleTransitionSequencer, {
              playingState: PLAYING_STATES.QUEUED,
              playQuant
            });

          case SESSION_PHASES.QUEUE_TRANS_4:
            return Object.assign({}, spinnyPluckL4TransitionSequencer, {
              playingState: PLAYING_STATES.QUEUED,
              playQuant
            });

          case SESSION_PHASES.QUEUE_TRANS_2:
            return Object.assign({}, spinnyPluckL2TransitionSequencer, {
              playingState: PLAYING_STATES.QUEUED,
              playQuant
            });

          case SESSION_PHASES.QUEUE_TRANS_ADVICE:
            return Object.assign({}, spinnyPluckRevealTransitionSequencer, {
              playingState: PLAYING_STATES.QUEUED,
              playQuant
            });
          default:
            break;
        }
      }
      return state;
    default:
      return state;
  }
}

// assumes parent reducer calling this at the right time.
function l6Sequencer (
  state,
  action,
  segments,
  sessionPhase,
  prevSessionPhase,
  sessionPhaseDurations
) {
  switch (action.type) {
    case actionTypes.SESSION_PHASE_ADVANCED:
      // session phase automatically advanced.  If it is a transition
      // we may need to re-queue
      let newProps;
      switch (action.payload.phase) {
        case SESSION_PHASES.TRANS_4:
          newProps = state.level4Props;
          break;
        case SESSION_PHASES.TRANS_2:
          newProps = state.level2Props;
          break;
        default:
          return state;
      }
      return Object.assign({}, state, {
        playingState: PLAYING_STATES.QUEUED,
        playQuant: createPhaseEndQuant(
          action.payload.phase,
          sessionPhaseDurations
        )
      }, newProps);
    case actionTypes.BUTTON_PRESSED:
      let segmentId = create_segmentId(
        action.payload.levelId,
        action.payload.segmentIndex
      );
      let segment = segments.byId[segmentId];
      let buttonSequencerId = segment.sequencerId;
      if (
          // button press was for this sequencer
          buttonSequencerId === state.sequencerId
      ) {
        if (
          // session phase just transitioned
          sessionPhase !== prevSessionPhase
          // to l6
          && sessionPhase === SESSION_PHASES.QUEUE_TRANS_6
        ) {
          // queue pressed sequencer for post-transition
          return Object.assign(
            {},
            state,
            {
              playingState: PLAYING_STATES.QUEUED,
              playQuant: createNextPhaseEndQuant(
                sessionPhase,
                sessionPhaseDurations
              )
            }
          );
        } else if (
          // we are currently playing level 6
          // TODO: when just queued, second button will not respond.
          sessionPhase === SESSION_PHASES.PLAYING_6
        ) {
          // queue if stopped
          if (state.playingState === PLAYING_STATES.STOPPED) {
            return Object.assign(
              {},
              state,
              {
                playingState: PLAYING_STATES.QUEUED,
                playQuant: [4, 1]
              }
            );
          }
        }
      }
      return state;
    default:
      return state;
  }
}

function chordProgSequencer (
  state,
  action,
  segments,
  sessionPhase,
  prevSessionPhase,
  sessionPhaseDurations
) {
  switch (action.type) {
    case actionTypes.SESSION_PHASE_ADVANCED:
      // session phase automatically advanced.  If it is a transition
      // we may need to re-queue
      switch (action.payload.phase) {
        case SESSION_PHASES.TRANS_2:
          return Object.assign({}, state, {
            playingState: PLAYING_STATES.QUEUED,
            playQuant: createPhaseEndQuant(
              action.payload.phase,
              sessionPhaseDurations
            )
          }, state.level2Props);
        
        default:
          return state;
      }
    case actionTypes.BUTTON_PRESSED:

      // segment corresponding to button pressed
      let segmentId = create_segmentId(
        action.payload.levelId,
        action.payload.segmentIndex
      );
      let segment = segments.byId[segmentId];
      let buttonSequencerId = segment.sequencerId;

      if (
        // button press was for this sequencer
        buttonSequencerId === state.sequencerId
      ) {

        if (
          // session phase just transitioned
          sessionPhase !== prevSessionPhase
          && sessionPhase === SESSION_PHASES.QUEUE_TRANS_4
        ) {
          // this is the first press for level 4
          return Object.assign({}, state, {
            playingState: PLAYING_STATES.QUEUED,
            bufSequence: [segment.sequencerProps.bufName],
            playQuant: createNextPhaseEndQuant(
              sessionPhase,
              sessionPhaseDurations
            )
          }, state.level4Props);
        } else if (sessionPhase === SESSION_PHASES.PLAYING_4) {
          // If this segment has already been pressed
          if (state.bufSequence.indexOf(segment.sequencerProps.bufName) > -1) {
            // do nothing
            return state;
          } else {
            // this segment hasn't been pressed yet, we will insert this
            // segment's sequencer params to the sequence
            // in this case we insert the buffer name
            let currentBufIndex = state.bufSequence.indexOf(state.event.bufName);
            let newState = Object.assign({}, state, {
              playQuant: state.defaultPlayQuant.slice()
            });
            newState.bufSequence = newState.bufSequence.slice();
            newState.bufSequence.splice(
              1+currentBufIndex,
              0,
              segment.sequencerProps.bufName
            );
            return newState;
          }
        }

      }
      return state;
    default:
      return state;
  }
}

function l2Sequencer (
  state,
  action,
  segments,
  sessionPhase,
  prevSessionPhase,
  sessionPhaseDurations
) {
  switch (action.type) {
    case actionTypes.BUTTON_PRESSED:
      let segmentId = create_segmentId(
        action.payload.levelId,
        action.payload.segmentIndex
      );
      let segment = segments.byId[segmentId];
      let buttonSequencerId = segment.sequencerId;
      if (
        // button pressed for this sequencer
        buttonSequencerId === state.sequencerId
      ) {

        if (
          // session phase transitioned
          sessionPhase !== prevSessionPhase
          && sessionPhase === SESSION_PHASES.QUEUE_TRANS_2
        ) {
          // queue self
          return Object.assign(
            {},
            state,
            {
              playingState: PLAYING_STATES.QUEUED,
              playQuant: createNextPhaseEndQuant(
                sessionPhase,
                sessionPhaseDurations
              )
            }
          );
        } else if (
          // we are currently playing 2
          sessionPhase === SESSION_PHASES.PLAYING_2
        ) {
          // queue if stopped
          return Object.assign(
            {},
            state,
            {
              playingState: PLAYING_STATES.QUEUED,
              playQuant: [4, 1]
            }
          );
        }
      }
      return state;
    
    default:
      return state;
  }
}

export default function sequencers (
  state = {},
  action,
  segments,
  levels,
  sessionPhase,
  prevSessionPhase,
  sessionPhaseDurations
) {
  state = awakeningSequencers.reducer(
    state,
    action
  );

  let newReveal = reveal(
    state.reveal,
    action,
    sessionPhase,
    sessionPhaseDurations
  );
  if (newReveal !== state.reveal) {
    state = Object.assign({}, state, {reveal: newReveal});
  }

  let newTrans = trans(
    state.trans,
    action,
    sessionPhase,
    prevSessionPhase,
    sessionPhaseDurations
  );
  if (newTrans !== state.trans) {
    state = Object.assign({}, state, {trans: newTrans});
  }
  
  l6SequencerIds.forEach(function (sequencerId) {
    let seq = l6Sequencer(
      state[sequencerId],
      action,
      segments,
      sessionPhase,
      prevSessionPhase,
      sessionPhaseDurations
    );
    if (seq !== state[sequencerId]) {
      state = Object.assign({}, state, {
        [sequencerId]: seq
      });
    }
  });

  let seq = chordProgSequencer(
    state.level_4,
    action,
    segments,
    sessionPhase,
    prevSessionPhase,
    sessionPhaseDurations
  );
  if (seq !== state.level_4) {
    state = Object.assign({}, state, {
      level_4: seq
    });
  }

  ['2_0', '2_1'].forEach(function (sequencerId) {
    let seq = l2Sequencer(
      state[sequencerId],
      action,
      segments,
      sessionPhase,
      prevSessionPhase,
      sessionPhaseDurations
    );
    if (seq !== state[sequencerId]) {
      state = Object.assign({}, state, {
        [sequencerId]: seq
      });
    }
  });

  switch (action.type) {
    case actionTypes.BUTTON_PRESSED:

      // if this was the press to transition a scene
      if (sessionPhase !== prevSessionPhase) {

        // stop sequencers during transition
        let stopQuant = createPhaseStartQuant(
          sessionPhase,
          sessionPhaseDurations
        );
        let sequencersToStop = [];
        switch (sessionPhase) {
          case SESSION_PHASES.QUEUE_TRANS_4:
            sequencersToStop = l6SequencerIds;
            break;
          case SESSION_PHASES.QUEUE_TRANS_2:
            sequencersToStop = [].concat(l6SequencerIds, ['level_4']);
            break;
          default:
            break;
        }
        state = Object.assign({}, state);
        sequencersToStop.forEach(function (sequencerId) {
          let seq = state[sequencerId];

          if (seq.playingState !== PLAYING_STATES.STOPPED) {
            state[sequencerId] = Object.assign({}, seq, {
              playingState: PLAYING_STATES.STOP_QUEUED,
              stopQuant: stopQuant
            });
          }
        });

      }
      break;

    default:
      break;
  }
  return state;
}
