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
import { action_starts_transition } from './sessionPhase'
import { TRANS_PHASE_DURATIONS, LEVEL_PLAYBACK_TYPE } from '../constants'
const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

//function create_initial_state () {
  //let initialState = {
    //'level_10-segment_0': awakeningSequencers.create_default_sequencer(
      //'level_10-segment_0',
      //'SimpleSequencer'
    //),
    //'level_10-segment_1': awakeningSequencers.create_default_sequencer(
      //'level_10-segment_1',
      //'SimpleSequencer'
    //),
    //'level_10-segment_2': awakeningSequencers.create_default_sequencer(
      //'level_10-segment_2',
      //'SimpleSequencer'
    //)
  //};
  //initialState['level_10-segment_0'].numBeats = 10;
  //initialState['level_10-segment_0'].releaseTime = 1.2;
  //initialState['level_10-segment_0'].pbind = {
    //degree: [8, 4, 4, 4, 4, 8, 4, 4, 4, 4],
    //octave: 4
  //};
  //initialState['level_10-segment_1'].numBeats = 10;
  //initialState['level_10-segment_1'].releaseTime = 0.2;
  //initialState['level_10-segment_1'].pbind = {
    //degree: [8, 4, 4, 4, 4, 8, 4, 4, 4, 4],
    //octave: 6
  //};
  //initialState['level_10-segment_2'].numBeats = 10;
  //initialState['level_10-segment_2'].releaseTime = 0.2;
  //initialState['level_10-segment_2'].pbind = {
    //degree: [8, 4, 4, 4, 4, 8, 4, 4, 4, 4],
    //octave: 8
  //};
  //return initialState;
//}

//function sequencer (state, action) {
  //switch (action.type) {
    //case actionTypes.BUTTON_PRESSED:
      //// assuming parent sequencer sent only when button is
      //// pressed for the segment containing this sequencer
      //// TODO: this will depend on other stuff
      //state = Object.assign({}, state);
      //state.playingState = PLAYING_STATES.QUEUED;
      //break;
    
    //default:
      //break;
  //}
  //return state;
//}
//
function action_starts_playback (action, sessionPhase) {
  var currentLevelId = get_playing_levelId_for_sessionPhase(sessionPhase);
  return (action.payload.levelId === currentLevelId);
}

export default function sequencers (
  state = {},
  action,
  segments,
  levels,
  sessionPhase,
  prevSessionPhase
) {
  state = awakeningSequencers.reducer(state, action);

  switch (action.type) {
    case actionTypes.BUTTON_PRESSED:
      let segmentId = create_segmentId(
        action.payload.levelId,
        action.payload.segmentIndex
      );
      let segment = segments.byId[segmentId];
      let sequencerId = segment.sequencerId;

      // if this was the press to transition a scene
      if (action_starts_transition(action, prevSessionPhase)) {
        // button was pressed for segment with this sequencer
        state = Object.assign({}, state);
        state[sequencerId] = Object.assign(
          {},
          state[sequencerId],
          {
            playingState: PLAYING_STATES.QUEUED,
            playQuant: [TRANS_PHASE_DURATIONS[sessionPhase], 1]
          }
        );
      } else if (action_starts_playback(action, sessionPhase)) {
        state = Object.assign({}, state);
        let level = levels.byId[action.payload.levelId];

        if (level.playbackType === LEVEL_PLAYBACK_TYPE.SEQUENTIAL) {
          //  get currently playing segment on this level
          let currentSegmentId = level.segmentPlaybackOrder[
            level.segmentPlaybackIndex
          ];
          let currentSegment = segments.byId[currentSegmentId];

          // get currently playing sequencer
          let currentSequencer = state[currentSegment.sequencerId];

          // dequeue all queued on this level
          Object.keys(state).forEach((sequencerId) => {
            let seq = state[sequencerId];

            switch (seq.playingState) {
              case PLAYING_STATES.QUEUED:
                state[sequencerId] = Object.assign({}, seq, {
                  playingState: PLAYING_STATES.STOPPED
                });
                break;

              case PLAYING_STATES.REQUEUED:
                state[sequencerId] = Object.assign({}, seq, {
                  playingState: PLAYING_STATES.PLAYING
                });
                break;
              default:
                break;
            }

          });

          // queue sequencer associated with button press once currently
          // playing one finishes
          state[sequencerId] = Object.assign(
            {},
            state[sequencerId],
            {
              playingState: PLAYING_STATES.QUEUED,
              playQuant: [currentSequencer.numBeats, 1]
            }
          );
        } else if (level.playbackType === LEVEL_PLAYBACK_TYPE.SIMULTANEOUS) {
          // just queue or stop sequencer associated with button press.
          if (state[sequencerId].playingState === PLAYING_STATES.PLAYING) {
            state[sequencerId] = Object.assign(
              {},
              state[sequencerId],
              {
                playingState: PLAYING_STATES.STOP_QUEUED,
                stopQuant: [
                  state[sequencerId].numBeats,
                  0
                ]
              }
            );
          } else if (state[sequencerId].playingState === PLAYING_STATES.STOPPED) {
            state[sequencerId] = Object.assign(
              {},
              state[sequencerId],
              {
                playingState: PLAYING_STATES.QUEUED,
                playQuant: [state[sequencerId].numBeats, 1]
              }
            );
          }
        }

      }


      break;

    case awakeningSequencers.actionTypes.SEQUENCER_PLAYING:
      // a sequencer just started playing
      let activeSequencer = state[action.payload.sequencerId];

      // get currently active level
      let activeLevelId = get_playing_levelId_for_sessionPhase(sessionPhase);
      if (activeLevelId) {
        let activeLevel = levels.byId[activeLevelId];

        if (activeLevel.playbackType === LEVEL_PLAYBACK_TYPE.SEQUENTIAL) {
          // get next segment
          let nextSegmentId = activeLevel.segmentPlaybackOrder[((
              activeLevel.segmentPlaybackIndex + 1
          ) % activeLevel.segmentPlaybackOrder.length)];
          let nextSegment = segments.byId[nextSegmentId];

          // queue next sequencer
          state = Object.assign({}, state);
          let nextSequencer = state[nextSegment.sequencerId];

          state[nextSegment.sequencerId] = Object.assign(
            {},
            state[nextSegment.sequencerId],
            {
              playingState: (
                nextSequencer.playingState === PLAYING_STATES.PLAYING
              ) ? PLAYING_STATES.REQUEUED : PLAYING_STATES.QUEUED,
              playQuant: [activeSequencer.numBeats, 1]
            }
          );
        }

      }
      break;
    
    default:
      break;
  }
  return state;
}
