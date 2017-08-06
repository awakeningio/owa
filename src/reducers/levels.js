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


function create_default_level (levelId, numSegments) {
  let level = {
    levelId,
    numSegments,
    sequencerIds: [],
    playingState: PLAYING_STATES.STOPPED
  };
  let i = 0;
  for (i = 0; i < numSegments; i++) {
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
  switch (action.type) {
    case actionTypes.SESSION_PHASE_ADVANCED:
      if (
        // if this level should be playing
        shouldBePlaying(state.levelId, action.payload.phase)
      ) {
        // if the level is not playing
        if (state.playingState == PLAYING_STATES.STOPPED) {
          // queue the levels sequencers
          state.playingState = PLAYING_STATES.QUEUED;
          levelSequencers.forEach((sequencer) => {
            sequencer.playingState = PLAYING_STATES.QUEUED;
          });
        }

      } else {
        // this level shouldn't be playing
        // TODO: test
        if (state.playingState == PLAYING_STATES.PLAYING) {
          state.playingState = PLAYING_STATES.STOP_QUEUED;
          levelSequencers.forEach((sequencer) => {
            sequencer.playingState = PLAYING_STATES.STOP_QUEUED;
          });
        }

      }
      break;

    case awakeningSequencers.actionTypes.SEQUENCER_STOPPED:

      // a sequencer just stopped
      // if it was one of our sequencers
      if (state.sequencerIds.includes(action.payload.sequencerId)) {
        // consider our level to have stopped
        state.playingState = PLAYING_STATES.STOPPED;
      }
      break;
    
    case awakeningSequencers.actionTypes.SEQUENCER_PLAYING:
      // if it was one of our sequencers
      if (state.sequencerIds.includes(action.payload.sequencerId)) {
        // if we just queued, we are definitely playing now
        if (state.playingState == PLAYING_STATES.QUEUED) {
          state.playingState = PLAYING_STATES.PLAYING;
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
    'level_10': create_default_level('level_10', 2),
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
