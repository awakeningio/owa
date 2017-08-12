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
const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;


function create_default_level (levelId, numSegments) {
  let level = {
    levelId,
    numSegments,
    sequencerIds: [],
    playingState: PLAYING_STATES.STOPPED,
    activeSequencerIndex: false,
    activeSequencerId: false,
    sequencerPlaybackOrder: []
  };
  let i = 0;
  // at first, sequencers play back in default ordering
  for (i = 0; i < numSegments; i++) {
    let sequencerId = `${levelId}-segment_${i}`;
    level.sequencerIds.push(sequencerId);
    level.sequencerPlaybackOrder.push(sequencerId);
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
          // set level as queued
          state.playingState = PLAYING_STATES.QUEUED;

          // queue the levels first sequencer
          state.activeSequencerIndex = 0;
          state.activeSequencerId = (
            state.sequencerPlaybackOrder[state.activeSequencerIndex]
          );
          let activeSequencer = sequencers[state.activeSequencerId];
          activeSequencer.playQuant = [
            activeSequencer.numBeats,
            0
          ];
          activeSequencer.playingState = PLAYING_STATES.QUEUED;
        }

      } else {
        // this level shouldn't be playing
        // TODO: test
        if (state.playingState == PLAYING_STATES.PLAYING) {
          // level gets STOP_QUEUED
          state.playingState = PLAYING_STATES.STOP_QUEUED;
          levelSequencers.forEach((sequencer) => {
            // all playing sequencers get STOP_QUEUED
            if (sequencer.playingState == PLAYING_STATES.PLAYING) {
              sequencer.playingState = PLAYING_STATES.STOP_QUEUED;
            } else {
              sequencer.playingState = PLAYING_STATES.STOPPED;
            }
          });
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
        console.log("activeSequencer.numBeats");
        console.log(activeSequencer.numBeats);
        sequencers[nextSequencerId].playQuant = [activeSequencer.numBeats, 0];
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
