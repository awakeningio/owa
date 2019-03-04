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
import { SESSION_PHASES, NEXT_SESSION_PHASES } from 'owa/constants'
import {
  getLevel6Sequencers,
  getLevel4Sequencer,
  getLevel2Sequencers,
  getSegmentIdToBufName
} from '../selectors';

const create_default_sequencer = awakeningSequencers.create_default_sequencer;
const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

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
    numBeats: 6 * 4,
    amp: 0.4
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
    amp: 0.3
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
    amp: 0.5
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
    case actionTypes.SESSION_PHASE_ADVANCED:
      switch (action.payload.phase) {
        case SESSION_PHASES.QUEUE_TRANS_ADVICE:
          return Object.assign({}, spinnyPluckRevealTransitionSequencer, {
            playingState: PLAYING_STATES.QUEUED,
            playQuant: createPhaseEndQuant(
              action.payload.phase,
              sessionPhaseDurations
            )
          });
        default:
          return state;
      }
    case actionTypes.BUTTON_PRESSED:
      // if this button pressed triggered a sessionPhase change
      if (prevSessionPhase !== sessionPhase) {
        const playQuant = [4, 4];
        // we may need to queue a transition now
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
    case actionTypes.INACTIVITY_TIMEOUT_EXCEEDED:
      return Object.assign({}, state, {
        playingState: PLAYING_STATES.STOP_QUEUED,
        stopQuant: [4, 4]
      });
    case actionTypes.SESSION_PHASE_ADVANCED:
      // session phase automatically advanced.
      
      // props to queue this sequencer after transition (if needed)
      const queueProps = {
        playingState: PLAYING_STATES.QUEUED,
        playQuant: createPhaseEndQuant(
          action.payload.phase,
          sessionPhaseDurations
        )
      };
      const queueStopProps = {
        playingState: PLAYING_STATES.STOP_QUEUED,
        stopQuant: createPhaseEndQuant(
          action.payload.phase,
          sessionPhaseDurations
        )
      };

      switch (action.payload.phase) {
        case SESSION_PHASES.TRANS_6:
          // prepare sequencer for PLAYING_6, do not queue auto
          return Object.assign(
            {},
            state,
            state.phaseProps[SESSION_PHASES.PLAYING_6]
          );
        case SESSION_PHASES.TRANS_4:
          // prepare sequencer for PLAYING_4, queue automatically
          return Object.assign(
            {},
            state,
            queueProps,
            state.phaseProps[SESSION_PHASES.PLAYING_4]
          );
        case SESSION_PHASES.TRANS_2:
          // prepare sequencer for PLAYING_2, queue automatically
          return Object.assign(
            {},
            state,
            queueProps,
            state.phaseProps[SESSION_PHASES.PLAYING_2]
          );
        case SESSION_PHASES.QUEUE_TRANS_ADVICE:
          return Object.assign({}, state, queueStopProps);
        default:
          return state;
      }
    case actionTypes.BUTTON_PRESSED:
      const segmentId = create_segmentId(
        action.payload.levelId,
        action.payload.segmentIndex
      );
      const segment = segments.byId[segmentId];
      const buttonSequencerId = segment.sequencerId;
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
              playQuant: [4, 4 + sessionPhaseDurations[NEXT_SESSION_PHASES[sessionPhase]]]
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
                playQuant: [4, 4]
              }
            );
          }
        }
      } else if (
        // button press was for another sequencer and the session phase
        // transitioned
        sessionPhase !== prevSessionPhase
      ) {
        // props if we want to stop this sequencer when this phase ends
        const queueStopProps = {
          playingState: PLAYING_STATES.STOP_QUEUED,
          stopQuant: [4, 4]
        };

        switch (sessionPhase) {
          case SESSION_PHASES.QUEUE_TRANS_4:
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
      // session phase automatically advanced.  If it is a transition
      // we may need to re-queue
      switch (action.payload.phase) {
        //case SESSION_PHASES.TRANS_4:
          //// prepare sequencer for playing 4, do not queue
          //return Object.assign(
            //{},
            //state,
            //state.phaseProps[SESSION_PHASES.PLAYING_4]
          //);
        case SESSION_PHASES.TRANS_2:
          return Object.assign({}, state, {
            playingState: PLAYING_STATES.QUEUED,
            playQuant: createPhaseEndQuant(
              action.payload.phase,
              sessionPhaseDurations
            )
          }, state.phaseProps[SESSION_PHASES.PLAYING_2]);
        case SESSION_PHASES.QUEUE_TRANS_ADVICE:
          return Object.assign({}, state, {
            playingState: PLAYING_STATES.STOP_QUEUED,
            stopQuant: createPhaseEndQuant(
              action.payload.phase,
              sessionPhaseDurations
            )
          });
        default:
          return state;
      }
    case actionTypes.BUTTON_PRESSED:

      // segment corresponding to button pressed
      const segmentId = create_segmentId(
        action.payload.levelId,
        action.payload.segmentIndex
      );
      const segment = segments.byId[segmentId];
      const buttonSequencerId = segment.sequencerId;

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
  segments,
  sessionPhase,
  prevSessionPhase,
  sessionPhaseDurations
) {
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
      const segment = segments.byId[segmentId];
      const buttonSequencerId = segment.sequencerId;
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
  state = {},
  action,
  fullState,
  prevSessionPhase
) {
  const segments = fullState.segments;
  const sessionPhase = fullState.sessionPhase;
  const sessionPhaseDurations = fullState.sessionPhaseDurations;

  state = awakeningSequencers.reducer(
    state,
    action
  );

  const newReveal = reveal(
    state.reveal,
    action,
    sessionPhase,
    sessionPhaseDurations
  );
  if (newReveal !== state.reveal) {
    state = Object.assign({}, state, {reveal: newReveal});
  }

  const newTrans = trans(
    state.trans,
    action,
    sessionPhase,
    prevSessionPhase,
    sessionPhaseDurations
  );
  if (newTrans !== state.trans) {
    state = Object.assign({}, state, {trans: newTrans});
  }

  const l6Sequencers = getLevel6Sequencers(fullState);
  l6Sequencers.forEach(function (seq) {
    const newSeq = l6Sequencer(
      seq,
      action,
      segments,
      sessionPhase,
      prevSessionPhase,
      sessionPhaseDurations
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
      segments,
      sessionPhase,
      prevSessionPhase,
      sessionPhaseDurations
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
