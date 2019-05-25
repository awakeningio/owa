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
  createPhaseEndQuant
} from 'owa/models'
import { apply_phase_props } from 'owa/models/sequencer';
import {
  SESSION_PHASES,
  NEXT_SESSION_PHASES
} from 'owa/constants'
import {
  getLevel6Sequencers,
  getLevel4Sequencer,
  getLevel2Sequencers,
  getRevealSequencer,
  getTransSequencer,
  getSegmentIdToBufName,
  getSegmentIdToSequencerId
} from '../selectors';
import sequencersInitialState from 'owa/state/sequencersInitialState';

const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

function revealSequencer (
  state,
  action,
  fullState
) {

  const {
    sessionPhaseDurations
  } = fullState;

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
      } else {
        return state;
      }
    default:
      return state;
  }
}

function transSequencer (
  state,
  action,
  fullState,
  prevSessionPhase
) {
  const {
    sessionPhase,
    sessionPhaseDurations
  } = fullState;
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
              playQuant: createPhaseEndQuant(
                action.payload.phase,
                sessionPhaseDurations
              )
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
        const playQuant = [4, 4];
        const queueProps = {
          playQuant,
          playingState: PLAYING_STATES.QUEUED
        };
        newState = apply_phase_props(newState, action.payload.phase);
        
        // we may need to queue a transition now
        switch (sessionPhase) {
          case SESSION_PHASES.QUEUE_TRANS_6:
          case SESSION_PHASES.QUEUE_TRANS_4:
          case SESSION_PHASES.QUEUE_TRANS_2:
            newState = {
              ...newState,
              ...queueProps
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
function l6Sequencer (
  state,
  action,
  fullState,
  prevSessionPhase
) {
  const {
    sessionPhase,
    sessionPhaseDurations
  } = fullState;

  let newState = state;

  switch (action.type) {
    case actionTypes.INACTIVITY_TIMEOUT_EXCEEDED:
      newState = {
        ...newState,
        playingState: PLAYING_STATES.STOP_QUEUED
      };
      break;
    case actionTypes.SESSION_PHASE_ADVANCED:
      newState = apply_phase_props(state, action.payload.phase);

      // Starts or stops level 6 sequencer depending on the phase
      switch (action.payload.phase) {
        case SESSION_PHASES.TRANS_4:
        case SESSION_PHASES.TRANS_2:
          newState = {
            ...newState,
            playingState: PLAYING_STATES.QUEUED,
            playQuant: createPhaseEndQuant(
              action.payload.phase,
              sessionPhaseDurations
            )
          };
          break;

        case SESSION_PHASES.QUEUE_TRANS_ADVICE:
          newState = {
            ...newState,
            playingState: PLAYING_STATES.STOP_QUEUED,
            stopQuant: createPhaseEndQuant(
              action.payload.phase,
              sessionPhaseDurations
            )
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
          const playQuant = newState.playQuant;
          if (
            // to l6
            sessionPhase === SESSION_PHASES.QUEUE_TRANS_6
          ) {
            // queue pressed sequencer for post-transition
            newState = Object.assign(
              {},
              newState,
              {
                playingState: PLAYING_STATES.QUEUED,
                playQuant: [playQuant[0], playQuant[0] + sessionPhaseDurations[NEXT_SESSION_PHASES[sessionPhase]]]
              }
            );
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
              };
              break;
            default:
              break;
          }
        }
      } else if (
        // we are currently playing level 6
        // TODO: when just queued, second button will not respond.
        sessionPhase === SESSION_PHASES.PLAYING_6
        // button press was for this sequencer
        && buttonSequencerId === state.sequencerId
      ) {
        // queue if stopped
        if (state.playingState === PLAYING_STATES.STOPPED) {
          newState = Object.assign(
            {},
            newState,
            {
              playingState: PLAYING_STATES.QUEUED
            }
          );
        }
      }
      break;
    default:
      break;
  }
  return newState;
}

function chordProgSequencer (
  state,
  action,
  fullState,
  prevSessionPhase,
) {
  const segmentIdToBufName = getSegmentIdToBufName(fullState);
  const sessionPhaseDurations = fullState.sessionPhaseDurations;
  const segments = fullState.segments;
  const sessionPhase = fullState.sessionPhase;
  switch (action.type) {
    case actionTypes.INACTIVITY_TIMEOUT_EXCEEDED:
      return Object.assign({}, state, {
        playingState: PLAYING_STATES.STOP_QUEUED,
        stopQuant: [4, 4]
      });
    case actionTypes.SESSION_PHASE_ADVANCED:
      let newState = apply_phase_props(state, action.payload.phase);

      // session phase automatically advanced.  If it is a transition
      // we may need to re-queue
      switch (action.payload.phase) {
        case SESSION_PHASES.TRANS_2:
          newState = Object.assign({}, newState, {
            playingState: PLAYING_STATES.QUEUED,
            playQuant: createPhaseEndQuant(
              action.payload.phase,
              sessionPhaseDurations
            )
          });
          break;
        case SESSION_PHASES.QUEUE_TRANS_ADVICE:
          newState = Object.assign({}, newState, {
            playingState: PLAYING_STATES.STOP_QUEUED,
            stopQuant: createPhaseEndQuant(
              action.payload.phase,
              sessionPhaseDurations
            )
          });
          break;
        default:
          break;
      }
      return newState;
    case actionTypes.BUTTON_PRESSED:

      // segment corresponding to button pressed
      const segmentId = create_segmentId(
        action.payload.levelId,
        action.payload.segmentIndex
      );
      const segment = segments.byId[segmentId];
      const buttonSequencerId = getSegmentIdToSequencerId(fullState)[segmentId];

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
            bufSequence: [segmentIdToBufName[segmentId]],
            //playQuant: createPhaseEndQuant(
              //sessionPhaseDurations[NEXT_SESSION_PHASES[sessionPhase]],
              //sessionPhaseDurations
            //)
            playQuant: [
              4,
              4 + sessionPhaseDurations[sessionPhase] + sessionPhaseDurations[NEXT_SESSION_PHASES[sessionPhase]]
            ]
          });
        } else if (sessionPhase === SESSION_PHASES.PLAYING_4) {
          // If this segment has already been pressed
          if (
            state.bufSequence.indexOf(
              segmentIdToBufName[segment.segmentId]
            ) > -1
          ) {
            // do nothing
            return state;
          } else {
            // this segment hasn't been pressed yet, we will insert this
            // segment's sequencer params to the sequence
            // in this case we insert the buffer name
            const currentBufIndex = state.bufSequence.indexOf(state.event.bufName);
            const newState = Object.assign({}, state, {
              playQuant: state.defaultPlayQuant.slice()
            });
            newState.bufSequence = newState.bufSequence.slice();
            newState.bufSequence.splice(
              1+currentBufIndex,
              0,
              segmentIdToBufName[segment.segmentId]
            );
            return newState;
          }
        }

      } else if (
        // press was for another sequencer that transitioned
        sessionPhase !== prevSessionPhase
      ) {
        const queueStopProps = {
          playingState: PLAYING_STATES.STOP_QUEUED,
          stopQuant: [4, 4]
        };
        switch (sessionPhase) {
          case SESSION_PHASES.QUEUE_TRANS_2:
            return Object.assign({}, state, queueStopProps);
          
          default:
            return state;
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
  fullState,
  prevSessionPhase
) {
  const {
    sessionPhase,
    sessionPhaseDurations
  } = fullState;
  switch (action.type) {
    case actionTypes.INACTIVITY_TIMEOUT_EXCEEDED:
      return Object.assign({}, state, {
        playingState: PLAYING_STATES.STOP_QUEUED,
        stopQuant: [4, 4]
      });
    case actionTypes.SESSION_PHASE_ADVANCED:
      switch (action.payload.phase) {
        case SESSION_PHASES.QUEUE_TRANS_ADVICE:
          // queue seq to stop for trans advice
          return Object.assign({}, state, {
            playingState: PLAYING_STATES.STOP_QUEUED,
            stopQuant: createPhaseEndQuant(sessionPhase, sessionPhaseDurations)
          });
        default:
          return state;
      }
    case actionTypes.BUTTON_PRESSED:
      const segmentId = create_segmentId(
        action.payload.levelId,
        action.payload.segmentIndex
      );
      const buttonSequencerId = getSegmentIdToSequencerId(fullState)[segmentId];
      if (
        // button pressed for this sequencer
        buttonSequencerId === state.sequencerId
      ) {

        if (
          // session phase transitioned
          sessionPhase !== prevSessionPhase
          && sessionPhase === SESSION_PHASES.QUEUE_TRANS_2
        ) {
          // queue self post-transition
          return Object.assign(
            {},
            state,
            {
              playingState: PLAYING_STATES.QUEUED,
              playQuant: [
                4,
                4 + sessionPhaseDurations[sessionPhase] + sessionPhaseDurations[NEXT_SESSION_PHASES[sessionPhase]]
              ]
            }
          );
        } else if (
          // we are currently playing 2
          sessionPhase === SESSION_PHASES.PLAYING_2
        ) {
          // queue if stopped
          if (state.playingState === PLAYING_STATES.STOPPED) {
            return Object.assign(
              {},
              state,
              {
                playingState: PLAYING_STATES.QUEUED,
                playQuant: [4, 4]
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

export default function sequencers (
  state = sequencersInitialState,
  action,
  fullState,
  prevSessionPhase
) {
  // Handles basic , stopping, queueing of all sequencers
  state = awakeningSequencers.reducer(
    state,
    action
  );

  // Handles OWA specific sequencer manipulations for reveal, transition,
  // and all levels (for current song)
  const currentRevealSequencer = getRevealSequencer(fullState);
  const newReveal = revealSequencer(
    currentRevealSequencer,
    action,
    fullState
  );
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
  l6Sequencers.forEach(function (seq) {
    const newSeq = l6Sequencer(
      seq,
      action,
      fullState,
      prevSessionPhase,
    );
    if (newSeq !== seq) {
      state = Object.assign({}, state, {
        [seq.sequencerId]: newSeq
      });
    }
  })

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
  level2Sequencers.forEach(function (seq) {
    const newSeq = l2Sequencer(
      seq,
      action,
      fullState,
      prevSessionPhase
    );
    if (seq !== newSeq) {
      state = Object.assign({}, state, {
        [seq.sequencerId]: newSeq
      });
    }
  })

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
