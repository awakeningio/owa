/**
 *  @file       levels.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { SESSION_PHASES } from '../constants';
import * as actionTypes from '../actionTypes';

import awakeningSequencers from 'awakening-sequencers';
import supercolliderRedux from "supercollider-redux";
const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;


//function create_default_segment (numSegments, segmentIndex) {
  //let segment = {
    //sequencerId: `level_${numSegments}-segment_${segmentIndex}`
  //};
  //return segment;
//}

function create_default_level (levelId, numSegments, segmentMeterQuant, beatDur, segmentDuration) {
  let level = {
    levelId,
    numSegments,
    //segments: [],
    sequencerIds: [],
    segmentMeterQuant,
    beatDur,
    segmentDuration,
    activeSequencerIndex: false,
    playingState: PLAYING_STATES.STOPPED
  };
  let i = 0;
  for (i = 0; i < numSegments; i++) {
    //level.segments.push(create_default_segment(numSegments, i));
    level.sequencerIds.push(`${levelId}-segment_${i}`);
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
  let levelSequencers = state.sequencerIds.map((sequencerId) => {
    return sequencers[sequencerId];
  });
  console.log("levelSequencers");
  console.log(levelSequencers);
  let activeSequencer = false;
  if (state.activeSequencerIndex !== false) {
    activeSequencer = levelSequencers[state.activeSequencerIndex];
  }
  switch (action.type) {
    case actionTypes.SESSION_PHASE_ADVANCED:
      if (
        // if this level should be playing
        shouldBePlaying(state.levelId, action.payload.phase)
      ) {
        // if the level is not playing
        if (state.playingState == PLAYING_STATES.STOPPED) {
          // queue the level's first sequencer
          state.playingState = PLAYING_STATES.QUEUED;
          state.activeSequencerIndex = 0;
          levelSequencers[state.activeSequencerIndex].playingState = PLAYING_STATES.QUEUED;
        }

      } else {
        // TODO: this level shouldn't be playing
        if (state.playingState == PLAYING_STATES.PLAYING) {
          state.playingState = PLAYING_STATES.STOP_QUEUED;
        }

      }
      break;

    //case awakeningSequencers.actionTypes.SEQUENCER_STOPPED:

      //// a sequencer just stopped

      //// if it was our active sequencer
      //if (action.payload.sequencerId == activeSequencer.sequencerId) {
        //// consider our level to have stopped
        //state.playingState = PLAYING_STATES.STOPPED;
        //state.activeSequencerIndex = false;
      //}
      //break;
    
    case supercolliderRedux.actionTypes.SUPERCOLLIDER_EVENTSTREAMPLAYER_NEXTBEAT:
      // if it was our active sequencer
      if (action.payload.id == activeSequencer.sequencerId) {
        // if we just queued, we are definitely playing now
        if (state.playingState == PLAYING_STATES.QUEUED) {
          state.playingState = PLAYING_STATES.PLAYING;
        }

        // if the active sequencer's stop has not yet been scheduled
        if (activeSequencer.playingState == PLAYING_STATES.PLAYING) {
          // schedule it
          activeSequencer.playingState = PLAYING_STATES.STOP_QUEUED;
          
          // if the level should keep playing
          if (state.playingState == PLAYING_STATES.PLAYING) {

            // move onto the next sequencer
            state.activeSequencerIndex = (
              state.activeSequencerIndex + 1
            ) % state.numSegments;

            levelSequencers[state.activeSequencerIndex].playingState = (
              PLAYING_STATES.QUEUED
            );

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
    'level_10': create_default_level('level_10', 2, 5, 1, 1),
    'level_8': create_default_level('level_8', 8),
    'level_6': create_default_level('level_6', 6),
    'level_4': create_default_level('level_4', 4),
    'level_2': create_default_level('level_2', 2)
  };
}

let levelNames = [
  'level_10',
  'level_8',
  'level_6',
  'level_4',
  'level_2'
];

export default function levels (state = create_default_state(), action, sequencers) {
  levelNames.forEach((levelName) => {
    state[levelName] = level(state[levelName], action, sequencers);
  });
  //switch (action.type) {
    //case actionTypes.SESSION_PHASE_ADVANCED:
      //switch (action.payload.phase) {
        //case SESSION_PHASES.PLAYING_10:
          //state.level_10.playingState = PLAYING_STATES.PLAYING;
          //state.level_10.activeSequencerIndex = 0;
          //break;

        //case SESSION_PHASES.PLAYING_8:
          //state.level_8.playingState = PLAYING_STATES.PLAYING;
          //state.level_8.activeSequencerIndex = 0;
          //break;

        //case SESSION_PHASES.PLAYING_6:
          //state.level_6.playingState = PLAYING_STATES.PLAYING;
          //state.level_6.activeSequencerIndex = 0;
          //break;

        //case SESSION_PHASES.PLAYING_4:
          //state.level_4.playingState = PLAYING_STATES.PLAYING;
          //state.level_4.activeSequencerIndex = 0;
          //break;

        //case SESSION_PHASES.TRANS_ADVICE:
          //state.level_10.playingState = PLAYING_STATES.STOP_QUEUED;
          //state.level_8.playingState = PLAYING_STATES.STOP_QUEUED;
          //state.level_6.playingState = PLAYING_STATES.STOP_QUEUED;
          //state.level_4.playingState = PLAYING_STATES.STOP_QUEUED;
          //break;
        
        //default:
          //break;
      //}
      //break;
    
    //default:
      //break;
  //}
  return state;
}
