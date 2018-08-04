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
import { create_segmentId, get_playing_levelId_for_sessionPhase } from '../models'
import { SESSION_PHASES, NEXT_SESSION_PHASES } from '../constants'

const create_default_sequencer = awakeningSequencers.create_default_sequencer;
const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

const l6SequencerIds = ['6_0', '6_1', '6_2', '6_3', '6_4', '6_5'];

/**
 *  Is this level the currently playing level?
 **/
function is_playing_level (levelId, sessionPhase) {
  var currentLevelId = get_playing_levelId_for_sessionPhase(sessionPhase);
  return (levelId === currentLevelId);
}

const baseTransitionSequencer = create_default_sequencer(
  'trans',
  'TransitionSequencer'
);

const spinnyPluckIdleTransitionSequencer = Object.assign(
  {},
  baseTransitionSequencer,
  {
    bufName: 'spinny-pluck_idle-L6',
    attackTime: 120.0/60.0 * 6,
    releaseTime: 0.0,
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
    numBeats: 5 * 4
  }
);

const spinnyPluckL2TransitionSequencer = Object.assign(
  {},
  baseTransitionSequencer,
  {
    bufName: 'spinny-pluck_L4-L2',
    attackTime: 0.01,
    releaseTime: 0.01,
    numBeats: 5 * 4
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
        let playQuant = [
          4,
          1 + sessionPhaseDurations[sessionPhase]
        ];
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
function l6Sequencer (state, action) {
  switch (action.type) {
    case actionTypes.BUTTON_PRESSED:
      if (state.playingState === PLAYING_STATES.PLAYING) {
        return Object.assign(
          {},
          state,
          {
            playingState: PLAYING_STATES.STOP_QUEUED,
            stopQuant: [
              4,
              1 + state.numBeats
            ]
          }
        );
      } else if (state.playingState === PLAYING_STATES.STOPPED) {
        return Object.assign(
          {},
          state,
          {
            playingState: PLAYING_STATES.QUEUED,
            playQuant: [4, 1]
          }
        );
      } else {
        return state;
      }
    default:
      return state;
  }
}

function l4Sequencer (state, action, segments) {
  switch (action.type) {
    case actionTypes.BUTTON_PRESSED:

      // segment corresponding to button pressed
      let segmentId = create_segmentId(
        action.payload.levelId,
        action.payload.segmentIndex
      );
      let segment = segments.byId[segmentId];

      if (state.playingState === PLAYING_STATES.STOPPED) {
        // this is the first press for level 4
        return Object.assign({}, state, {
          playingState: PLAYING_STATES.QUEUED,
          bufSequence: [segment.sequencerProps.bufName]
        });
      } else {
        // level 4 is already playing.  If this segment has already been
        // pressed
        if (state.bufSequence.indexOf(segment.sequencerProps.bufName) > -1) {
          // do nothing
          return state;
        } else {
          // this segment hasn't been pressed yet, we will insert this
          // segment's sequencer params to the sequence
          // in this case we insert the buffer name
          let currentBufIndex = state.bufSequence.indexOf(state.event.bufName);
          let newState = Object.assign({}, state);
          newState.bufSequence = newState.bufSequence.slice();
          newState.bufSequence.splice(
            1+currentBufIndex,
            0,
            segment.sequencerProps.bufName
          );
          return newState;
        }
      }
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

  // trans sequencer has its own reducer
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

  switch (action.type) {
    case actionTypes.SESSION_PHASE_ADVANCED:
      // session phase automatically advanced
      // queue all sequencers at end of transition
      let playQuant = [
        4,
        1 + sessionPhaseDurations[action.payload.phase]
      ];
      let sequencersToQueue = [];
      switch (action.payload.phase) {
        case SESSION_PHASES.TRANS_4:
          sequencersToQueue = l6SequencerIds;
          break;
        case SESSION_PHASES.TRANS_2:
          sequencersToQueue = [].concat(l6SequencerIds, 'level_4');
          break;
        default:
          break;
      }
      state = Object.assign({}, state);
      sequencersToQueue.forEach(function (sequencerId) {
        let seq = state[sequencerId];
        state[sequencerId] = Object.assign({}, seq, {
          playingState: PLAYING_STATES.QUEUED,
          playQuant: playQuant
        });
      });
      break;
    case actionTypes.BUTTON_PRESSED:
      let segmentId = create_segmentId(
        action.payload.levelId,
        action.payload.segmentIndex
      );
      let segment = segments.byId[segmentId];
      let sequencerId = segment.sequencerId;

      // if this was the press to transition a scene
      if (sessionPhase !== prevSessionPhase) {

        // queue pressed sequencer
        switch (sessionPhase) {
          case SESSION_PHASES.QUEUE_TRANS_6:
          case SESSION_PHASES.QUEUE_TRANS_4:
          case SESSION_PHASES.QUEUE_TRANS_2:
            state = Object.assign({}, state);
            let playQuant = [
              4,
              1 + sessionPhaseDurations[sessionPhase]
              + sessionPhaseDurations[
                NEXT_SESSION_PHASES[sessionPhase]
              ],
            ];
            state[sequencerId] = Object.assign(
              {},
              state[sequencerId],
              {
                playingState: PLAYING_STATES.QUEUED,
                playQuant
              }
            );
            break;
          default:
            break;
        }

        // stop all sequencers for transition
        let stopQuant = [
          4,
          sessionPhaseDurations[sessionPhase]
        ];
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

      } else if (is_playing_level(action.payload.levelId, sessionPhase)) {
        // if level with this button press is currently playing, handle button
        // press in sub-reducer.
        let seq;
        //state = Object.assign({}, state);
        //let level = levels.byId[action.payload.levelId];
        //

        switch (action.payload.levelId) {
          case 'level_6':
            seq = l6Sequencer(state[sequencerId], action);
            break;

          case 'level_4':
            seq = l4Sequencer(state[sequencerId], action, segments);
            break;
          default:
            break;
        }

        if (seq !== state[sequencerId]) {
          state = Object.assign({}, state, {
            [sequencerId]: seq
          });
        }

        //if (level.playbackType === LEVEL_PLAYBACK_TYPE.SEQUENTIAL) {
          ////  get currently playing segment on this level
          //let currentSegmentId = level.segmentPlaybackOrder[
            //level.segmentPlaybackIndex
          //];
          //let currentSegment = segments.byId[currentSegmentId];

          //// get currently playing sequencer
          //let currentSequencer = state[currentSegment.sequencerId];

          // get sequencer for this level
          //let levelSequencer = state[level.levelId];

          //// dequeue all queued on this level
          //Object.keys(state).forEach((sequencerId) => {
            //let seq = state[sequencerId];

            //switch (seq.playingState) {
              //case PLAYING_STATES.QUEUED:
                //state[sequencerId] = Object.assign({}, seq, {
                  //playingState: PLAYING_STATES.STOPPED
                //});
                //break;

              //case PLAYING_STATES.REQUEUED:
                //state[sequencerId] = Object.assign({}, seq, {
                  //playingState: PLAYING_STATES.PLAYING
                //});
                //break;
              //default:
                //break;
            //}

          //});

          // queue sequencer associated with button press for when currently
          // playing one finishes
          //state[sequencerId] = Object.assign(
            //{},
            //state[sequencerId],
            //{
              //playingState: PLAYING_STATES.QUEUED,
              //playQuant: currentSequencer.playQuant.slice()
            //}
          //);
        //} else if (level.playbackType === LEVEL_PLAYBACK_TYPE.SIMULTANEOUS) {
          //// queue or stop sequencer associated with button press.
        //}

      }


      break;

    case awakeningSequencers.actionTypes.SEQUENCER_PLAYING:
      // a sequencer just started playing
      //state = Object.assign({}, state);
      //let activeSequencer = state[action.payload.sequencerId];

      // get currently active level
      //let activeLevelId = get_playing_levelId_for_sessionPhase(sessionPhase);
      //if (activeLevelId) {
        //let activeLevel = levels.byId[activeLevelId];

        //if (activeLevel.playbackType === LEVEL_PLAYBACK_TYPE.SEQUENTIAL) {
          //// get next segment
          //let nextSegmentId = activeLevel.segmentPlaybackOrder[((
              //activeLevel.segmentPlaybackIndex + 1
          //) % activeLevel.segmentPlaybackOrder.length)];
          //let nextSegment = segments.byId[nextSegmentId];

          //// queue next sequencer
          //let nextSequencer = state[nextSegment.sequencerId];

          //state[nextSegment.sequencerId] = Object.assign(
            //{},
            //state[nextSegment.sequencerId],
            //{
              //playingState: (
                //nextSequencer.playingState === PLAYING_STATES.PLAYING
              //) ? PLAYING_STATES.REQUEUED : PLAYING_STATES.QUEUED,
              //playQuant: activeSequencer.playQuant.slice()
            //}
          //);
        //}

      //}
      break;
    default:
      break;
  }
  return state;
}
