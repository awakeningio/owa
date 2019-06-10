/**
 *  @file       sequencers.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import awakeningSequencers from "awakening-sequencers";
import * as actionTypes from "../actionTypes";
import { create_segmentId, createPhaseEndQuant } from "owa/models";
import {
  apply_phase_props,
  do_queue_on_phase_start
} from "owa/models/sequencer";
import { SESSION_PHASES } from "owa/constants";
import {
  getLevel6Sequencers,
  getLevel4Sequencer,
  getLevel2Sequencers,
  getRevealSequencer,
  getTransSequencer,
  getSegmentIdToSequencerId
} from "../selectors";
import sequencersInitialState from "owa/state/sequencersInitialState";

const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

function revealSequencer(state, action, fullState) {
  const { songId } = fullState;

  let newState = state;

  switch (action.type) {
    case actionTypes.SESSION_PHASE_ADVANCED:
      if (action.payload.phase === SESSION_PHASES.TRANS_ADVICE) {
        newState = {
          ...newState,
          playingState: PLAYING_STATES.QUEUED,
          playQuant: createPhaseEndQuant(action.payload.phase, songId)
        };
      }
      break;
    default:
      break;
  }
  return newState;
}

function transSequencer(state, action, fullState, prevSessionPhase) {
  const { sessionPhase, songId } = fullState;
  let newState = state;
  switch (action.type) {
    case actionTypes.SESSION_PHASE_ADVANCED:
      newState = apply_phase_props(newState, action.payload.phase);

      switch (action.payload.phase) {
        case SESSION_PHASES.QUEUE_TRANS_ADVICE:
          newState = {
            ...newState,
            ...{
              playingState: PLAYING_STATES.QUEUED,
              playQuant: createPhaseEndQuant(action.payload.phase, songId)
            }
          };
          break;
        default:
          break;
      }
      break;
    case actionTypes.BUTTON_PRESSED:
      // if this button pressed triggered a sessionPhase change
      if (prevSessionPhase !== sessionPhase) {
        newState = apply_phase_props(newState, sessionPhase);

        // we may need to queue a transition now
        switch (sessionPhase) {
          case SESSION_PHASES.QUEUE_TRANS_6:
          case SESSION_PHASES.QUEUE_TRANS_4:
          case SESSION_PHASES.QUEUE_TRANS_2:
            newState = {
              ...newState,
              playQuant: createPhaseEndQuant(sessionPhase, songId),
              playingState: PLAYING_STATES.QUEUED
            };
            break;

          default:
            break;
        }
      }
      break;
    default:
      break;
  }
  return newState;
}

// assumes parent reducer calling this at the right time.
function l6Sequencer(state, action, fullState, prevSessionPhase) {
  const { sessionPhase, songId } = fullState;

  let newState = state;

  switch (action.type) {
    case actionTypes.INACTIVITY_TIMEOUT_EXCEEDED:
      newState = {
        ...newState,
        playingState: PLAYING_STATES.STOP_QUEUED,
        stopQuant: [4, 4]
      };
      break;
    case actionTypes.SESSION_PHASE_ADVANCED:
      newState = apply_phase_props(state, action.payload.phase);
      newState = do_queue_on_phase_start(
        newState,
        action.payload.phase,
        songId
      );

      // Starts or stops level 6 sequencer depending on the phase
      switch (action.payload.phase) {
        case SESSION_PHASES.TRANS_4:
        case SESSION_PHASES.TRANS_2:
          newState = {
            ...newState,
            playingState: PLAYING_STATES.QUEUED,
            playQuant: createPhaseEndQuant(action.payload.phase, songId)
          };
          break;

        case SESSION_PHASES.QUEUE_TRANS_ADVICE:
          newState = {
            ...newState,
            playingState: PLAYING_STATES.STOP_QUEUED,
            stopQuant: createPhaseEndQuant(action.payload.phase, songId, true)
          };
          break;
        default:
          break;
      }
      break;

    case actionTypes.BUTTON_PRESSED:
      const segmentId = create_segmentId(
        action.payload.levelId,
        action.payload.segmentIndex
      );
      const buttonSequencerId = getSegmentIdToSequencerId(fullState)[segmentId];
      if (
        // session phase just transitioned
        sessionPhase !== prevSessionPhase
      ) {
        newState = apply_phase_props(newState, sessionPhase);

        if (
          // button press was for this sequencer
          buttonSequencerId === state.sequencerId
        ) {
          if (
            // to l6
            sessionPhase === SESSION_PHASES.QUEUE_TRANS_6
          ) {
            // queue pressed sequencer for post-transition
            newState = {
              ...newState,
              queueOnPhaseStart: SESSION_PHASES.TRANS_6
            };
            //newState = Object.assign(
            //{},
            //newState,
            //{
            //playingState: PLAYING_STATES.QUEUED,
            //playQuant: createNextPhaseEndQuant(sessionPhase, songId)
            //}
            //);
          }
        } else {
          // button press was for another sequencer and the session phase
          // transitioned
          switch (sessionPhase) {
            case SESSION_PHASES.QUEUE_TRANS_4:
            case SESSION_PHASES.QUEUE_TRANS_2:
              newState = {
                ...newState,
                playingState: PLAYING_STATES.STOP_QUEUED,
                stopQuant: createPhaseEndQuant(sessionPhase, songId)
              };
              break;
            default:
              break;
          }
        }
      } else if (
        // we are currently playing level 6
        // TODO: when just queued, second button will not respond.
        sessionPhase === SESSION_PHASES.PLAYING_6 &&
        // button press was for this sequencer
        buttonSequencerId === state.sequencerId
      ) {
        // queue if stopped
        if (state.playingState === PLAYING_STATES.STOPPED) {
          newState = Object.assign({}, newState, {
            playingState: PLAYING_STATES.QUEUED
          });
        }
      }
      break;
    default:
      break;
  }
  return newState;
}

function chordProgSequencer(state, action, fullState, prevSessionPhase) {
  const { segments, sessionPhase, songId } = fullState;
  let newState = state;
  switch (action.type) {
    case actionTypes.INACTIVITY_TIMEOUT_EXCEEDED:
      newState = {
        ...newState,
        playingState: PLAYING_STATES.STOP_QUEUED,
        stopQuant: [4, 4]
      };
      break;
    case actionTypes.SESSION_PHASE_ADVANCED:
      newState = apply_phase_props(newState, action.payload.phase);
      newState = do_queue_on_phase_start(
        newState,
        action.payload.phase,
        songId
      );

      // session phase automatically advanced.  If it is a transition
      // we may need to re-queue
      switch (action.payload.phase) {
        case SESSION_PHASES.TRANS_2:
          newState = Object.assign({}, newState, {
            playingState: PLAYING_STATES.QUEUED,
            playQuant: createPhaseEndQuant(action.payload.phase, songId)
          });
          break;
        case SESSION_PHASES.QUEUE_TRANS_ADVICE:
          newState = Object.assign({}, newState, {
            playingState: PLAYING_STATES.STOP_QUEUED,
            stopQuant: createPhaseEndQuant(action.payload.phase, songId, true)
          });
          break;
        default:
          break;
      }
      break;
    case actionTypes.BUTTON_PRESSED:
      // segment corresponding to button pressed
      const segmentId = create_segmentId(
        action.payload.levelId,
        action.payload.segmentIndex
      );
      const segment = segments.byId[segmentId];
      const buttonSequencerId = getSegmentIdToSequencerId(fullState)[segmentId];

      if (sessionPhase !== prevSessionPhase) {
        newState = apply_phase_props(newState, sessionPhase);

        if (
          // button press was for this sequencer
          buttonSequencerId === newState.sequencerId
        ) {
          if (
            // session phase just transitioned
            sessionPhase === SESSION_PHASES.QUEUE_TRANS_4
          ) {
            // this is the first press for level 4
            newState = {
              ...newState,
              queueOnPhaseStart: SESSION_PHASES.TRANS_4,
              //playingState: PLAYING_STATES.QUEUED,
              bufSequence: [newState.segmentIdToBufName[segmentId]]
              //playQuant: createNextPhaseEndQuant(sessionPhase, songId)
            };
          }
        } else if (
          // press was for another sequencer that transitioned
          sessionPhase !== prevSessionPhase
        ) {
          switch (sessionPhase) {
            case SESSION_PHASES.QUEUE_TRANS_2:
              newState = {
                ...newState,
                playingState: PLAYING_STATES.STOP_QUEUED,
                stopQuant: createPhaseEndQuant(sessionPhase, songId)
              };
              break;

            default:
              break;
          }
        }
      } else if (
        sessionPhase === SESSION_PHASES.PLAYING_4
        // button press was for this sequencer
        && buttonSequencerId === newState.sequencerId
      ) {
        const segmentBuf = newState.segmentIdToBufName[segment.segmentId];
        if (newState.bufSequence.indexOf(segmentBuf) < 0) {
          // this segment hasn't been pressed yet, we will insert this
          // segment's sequencer params to the sequence
          // in this case we insert the buffer name
          const currentBufIndex = newState.bufSequence.indexOf(
            newState.event.bufName
          );
          newState = {
            ...newState,
            playQuant: newState.defaultPlayQuant.slice(),
            bufSequence: newState.bufSequence.slice()
          };
          newState.bufSequence.splice(1 + currentBufIndex, 0, segmentBuf);
          break;
        }
      }

      break;
    default:
      break;
  }
  return newState;
}

function l2Sequencer(state, action, fullState, prevSessionPhase) {
  const { sessionPhase, songId } = fullState;
  let newState = state;
  switch (action.type) {
    case actionTypes.INACTIVITY_TIMEOUT_EXCEEDED:
      newState = {
        ...newState,
        playingState: PLAYING_STATES.STOP_QUEUED,
        stopQuant: [4, 4]
      };
      break;
    case actionTypes.SESSION_PHASE_ADVANCED:
      newState = apply_phase_props(newState, action.payload.phase);
      newState = do_queue_on_phase_start(
        newState,
        action.payload.phase,
        songId
      );
      if (action.payload.phase === SESSION_PHASES.QUEUE_TRANS_ADVICE) {
        // queue seq to stop for trans advice
        newState = {
          ...newState,
          playingState: PLAYING_STATES.STOP_QUEUED,
          stopQuant: createPhaseEndQuant(sessionPhase, songId, true)
        };
      }
      break;
    case actionTypes.BUTTON_PRESSED:
      const segmentId = create_segmentId(
        action.payload.levelId,
        action.payload.segmentIndex
      );
      const buttonSequencerId = getSegmentIdToSequencerId(fullState)[segmentId];
      if (
        // session phase transitioned
        sessionPhase !== prevSessionPhase
      ) {
        if (
          // button pressed for this sequencer
          buttonSequencerId === state.sequencerId &&
          sessionPhase === SESSION_PHASES.QUEUE_TRANS_2
        ) {
          // queue self post-transition
          newState = {
            ...newState,
            queueOnPhaseStart: SESSION_PHASES.TRANS_2
            //playingState: PLAYING_STATES.QUEUED,
            //playQuant: createNextPhaseEndQuant(sessionPhase, songId)
          };
        }
      } else if (
        // we are currently playing 2
        sessionPhase === SESSION_PHASES.PLAYING_2 &&
        // button pressed for this sequencer
        buttonSequencerId === state.sequencerId
      ) {
        // queue if stopped
        if (state.playingState === PLAYING_STATES.STOPPED) {
          newState = {
            ...newState,
            playingState: PLAYING_STATES.QUEUED
          };
        }
      }
      break;
    default:
      break;
  }
  return newState;
}

export default function sequencers(
  state = sequencersInitialState,
  action,
  fullState,
  prevSessionPhase
) {
  // Handles basic , stopping, queueing of all sequencers
  state = awakeningSequencers.reducer(state, action);

  // Handles OWA specific sequencer manipulations for reveal, transition,
  // and all levels (for current song)
  const currentRevealSequencer = getRevealSequencer(fullState);
  const newReveal = revealSequencer(currentRevealSequencer, action, fullState);
  if (newReveal !== currentRevealSequencer) {
    state = {
      ...state,
      ...{
        [newReveal.sequencerId]: newReveal
      }
    };
  }

  const currentTransSequencer = getTransSequencer(fullState);
  const newTrans = transSequencer(
    currentTransSequencer,
    action,
    fullState,
    prevSessionPhase
  );
  if (newTrans !== currentTransSequencer) {
    state = {
      ...state,
      ...{
        [newTrans.sequencerId]: newTrans
      }
    };
  }

  const l6Sequencers = getLevel6Sequencers(fullState);
  l6Sequencers.forEach(function(seq) {
    const newSeq = l6Sequencer(seq, action, fullState, prevSessionPhase);
    if (newSeq !== seq) {
      state = Object.assign({}, state, {
        [seq.sequencerId]: newSeq
      });
    }
  });

  const level4Sequencer = getLevel4Sequencer(fullState);
  const newLevel4Sequencer = chordProgSequencer(
    level4Sequencer,
    action,
    fullState,
    prevSessionPhase
  );
  if (level4Sequencer !== newLevel4Sequencer) {
    state = Object.assign({}, state, {
      [level4Sequencer.sequencerId]: newLevel4Sequencer
    });
  }

  const level2Sequencers = getLevel2Sequencers(fullState);
  level2Sequencers.forEach(function(seq) {
    const newSeq = l2Sequencer(seq, action, fullState, prevSessionPhase);
    if (seq !== newSeq) {
      state = Object.assign({}, state, {
        [seq.sequencerId]: newSeq
      });
    }
  });

  //switch (action.type) {
  //case actionTypes.BUTTON_PRESSED:

  //// if this was the press to transition a scene
  //if (sessionPhase !== prevSessionPhase) {

  //// stop sequencers during transition
  //let stopQuant = createPhaseStartQuant(
  //sessionPhase,
  //sessionPhaseDurations
  //);
  //let sequencersToStop = [];
  //switch (sessionPhase) {
  //case SESSION_PHASES.QUEUE_TRANS_4:
  //sequencersToStop = l6SequencerIds;
  //break;
  //case SESSION_PHASES.QUEUE_TRANS_2:
  //sequencersToStop = [].concat(l6SequencerIds, ['level_4']);
  //break;
  //default:
  //break;
  //}
  //state = Object.assign({}, state);
  //sequencersToStop.forEach(function (sequencerId) {
  //let seq = state[sequencerId];

  //if (seq.playingState !== PLAYING_STATES.STOPPED) {
  //state[sequencerId] = Object.assign({}, seq, {
  //playingState: PLAYING_STATES.STOP_QUEUED,
  //stopQuant: stopQuant
  //});
  //}
  //});

  //}
  //break;

  //default:
  //break;
  //}
  return state;
}
