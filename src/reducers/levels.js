/**
 *  @file       levels.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { SESSION_PHASES } from '../constants';
import * as actionTypes from '../actionTypes';

import { create_initial_segment, segment } from './segments'

import awakeningSequencers from 'awakening-sequencers';
const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;


function create_default_level (levelId, numSegments) {
  let level = {
    levelId,
    segments: {},
    numSegments,
    segmentPlaybackOrder: [],
    activeSegmentIndex: false,
    activeSegmentId: false,
    playingState: PLAYING_STATES.STOPPED,
  };
  let i = 0;
  // create all segments
  for (i = 0; i < numSegments; i++) {
    let segmentId = `${levelId}-segment_${i}`;
    let segment = create_initial_segment(segmentId);
    level.segments[segmentId] = segment;
    // at first, sequencers play back in default ordering
    level.segmentPlaybackOrder.push(segmentId);
  }

  return level;

}

function shouldBePlaying (levelId, sessionPhase) {
  if ([
    SESSION_PHASES.IDLE,
    SESSION_PHASES.TRANS_10,
    SESSION_PHASES.PLAYING_ADVICE,
    SESSION_PHASES.TRANS_IDLE
  ].includes(sessionPhase)) {
    return false;
  } else if ([
    SESSION_PHASES.PLAYING_10,
    SESSION_PHASES.TRANS_8
  ].includes(sessionPhase)) {
    return (['level_10'].includes(levelId));
  } else if (sessionPhase in [
    SESSION_PHASES.PLAYING_8,
    SESSION_PHASES.TRANS_6
  ]) {
    return (['level_10', 'level_8'].includes(levelId));
  } else if (sessionPhase in [
    SESSION_PHASES.PLAYING_6,
    SESSION_PHASES.TRANS_4
  ]) {
    return (['level_10', 'level_8', 'level_6'].includes(levelId));
  } else if ([
    SESSION_PHASES.PLAYING_4,
    SESSION_PHASES.ADVICE_READY
  ].includes(sessionPhase)) {
    return true;
  }
}

function level (state, action, sequencers) {
  // if a button was pressed, this is the level id of the button press
  let buttonLevelId;

  switch (action.type) {
    case actionTypes.SESSION_PHASE_ADVANCED:
      if (
        // if this level should be playing
        shouldBePlaying(state.levelId, action.payload.phase)
      ) {
        // if the level is not playing
        if (state.playingState == PLAYING_STATES.STOPPED) {
          // set level as queued
          state.playingState = PLAYING_STATES.QUEUED;

          // queue the levels first segment
          state.activeSegmentIndex = 0;
          state.activeSegmentId = state.segmentPlaybackOrder[
            state.activeSegmentIndex
          ]
          state.segments[state.activeSegmentId].playingState = (
            PLAYING_STATES.QUEUED
          );

          //// queue the levels first sequencer
          //state.activeSequencerIndex = 0;
          //state.activeSequencerId = (
            //state.sequencerPlaybackOrder[state.activeSequencerIndex]
          //);
          //let activeSequencer = sequencers[state.activeSequencerId];
          //activeSequencer.playQuant = [
            //activeSequencer.numBeats,
            //0
          //];
        }

      } else {
        // this level shouldn't be playing
        // TODO: test
        if (state.playingState == PLAYING_STATES.PLAYING) {
          console.log("TODO: stop the level");
          // level gets STOP_QUEUED
          //state.playingState = PLAYING_STATES.STOP_QUEUED;
          //levelSequencers.forEach((sequencer) => {
            //// all playing sequencers get STOP_QUEUED
            //if (sequencer.playingState == PLAYING_STATES.PLAYING) {
              //sequencer.playingState = PLAYING_STATES.STOP_QUEUED;
            //} else {
              //sequencer.playingState = PLAYING_STATES.STOPPED;
            //}
          //});
        }

      }
      break;

    case awakeningSequencers.actionTypes.SEQUENCER_STOPPED:
      // a sequencer just stopped
      // if we are queued to stop
      if (state.playingState == PLAYING_STATES.STOP_QUEUED) {
        // if it was one of our sequencers
        if (state.sequencerIds.includes(action.payload.sequencerId)) {

          // are all of our sequencers stopped now?
          let allSequencersStopped = true;
          levelSequencers.forEach((sequencer) => {
            if (sequencer.playingState != PLAYING_STATES.STOPPED) {
              allSequencersStopped = false;
            }
          });

          if (allSequencersStopped) {
            // consider our level to have stopped
            state.playingState = PLAYING_STATES.STOPPED;
            state.activeSequencerIndex = false;
          }
        }
      }
      break;
    
    case awakeningSequencers.actionTypes.SEQUENCER_PLAYING:
      // if it was one of our sequencers
      if (state.sequencerIds.includes(action.payload.sequencerId)) {
        // the sequencer that started playing is our activeSequencer
        state.activeSequencerId = action.payload.sequencerId;

        // if we just queued, we are definitely playing now
        if (state.playingState == PLAYING_STATES.QUEUED) {
          state.playingState = PLAYING_STATES.PLAYING;
        } else {
          // increment our active index
          state.activeSequencerIndex = (
            (state.activeSequencerIndex + 1) % state.numSegments
          );
        }

        let activeSequencer = sequencers[state.activeSequencerId];

        // queue the next sequencer
        let nextSequencerIndex = (
          (state.activeSequencerIndex + 1) % state.numSegments
        );
        let nextSequencerId = state.sequencerPlaybackOrder[nextSequencerIndex];
        sequencers[nextSequencerId].playingState = PLAYING_STATES.QUEUED;
        sequencers[nextSequencerId].playQuant = [activeSequencer.numBeats, 0];
      }
      break;
    
    case actionTypes.BUTTON_PRESSED:
      // if the press was for this level
      buttonLevelId = `level_${action.payload.level}`;
      if (buttonLevelId == state.levelId) {
        // if this level is playing
        if (state.playingState == PLAYING_STATES.PLAYING) {
          let selectedSequencerId = (
            `level_${action.payload.level}-segment_${action.payload.position}`
          );
          let selectedSequencerIndex = state.sequencerPlaybackOrder.indexOf(
            selectedSequencerId
          );
          console.log("selectedSequencerId");
          console.log(selectedSequencerId);
          console.log("selectedSequencerIndex");
          console.log(selectedSequencerIndex);

          // stop queued sequencer
          let nextSequencerIndex = (
            (state.activeSequencerIndex + 1) % state.numSegments
          );
          let nextSequencerId = state.sequencerPlaybackOrder[
            nextSequencerIndex
          ];
          
          if (
            selectedSequencerIndex == nextSequencerIndex ||
            selectedSequencerIndex == state.activeSequencerIndex
          ) {
            // do nothing
            break;
          } else {
            // stop next sequencer
            sequencers[nextSequencerId].playingState = PLAYING_STATES.STOPPED;

            // swap selected sequencer with one that would have been next
            state.sequencerPlaybackOrder[nextSequencerIndex] = (
              selectedSequencerId
            );
            state.sequencerPlaybackOrder[selectedSequencerIndex] = (
              nextSequencerId
            );

            // queue new next one
            sequencers[selectedSequencerId].playingState = PLAYING_STATES.QUEUED;
            let activeSequencer = sequencers[state.activeSequencerId];
            sequencers[selectedSequencerId].playQuant = [
              activeSequencer.numBeats,
              0
            ];
          }

        }
      }
      break;
    default:
      break;
  }
  return state;
}

function create_default_state () {
  return {
    'level_10': create_default_level('level_10', 3),
    //'level_8': create_default_level('level_8', 8),
    //'level_6': create_default_level('level_6', 6),
    //'level_4': create_default_level('level_4', 4),
    //'level_2': create_default_level('level_2', 2)
  };
}

let levelNames = [
  'level_10',
  //'level_8',
  //'level_6',
  //'level_4',
  //'level_2'
];

export default function levels (state = create_default_state(), action, sequencers) {
  levelNames.forEach((levelName) => {
    state[levelName] = level(state[levelName], action, sequencers);
  });
  return state;
}
