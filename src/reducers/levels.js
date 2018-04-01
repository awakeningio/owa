/**
 *  @file       levels.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import awakeningSequencers from 'awakening-sequencers';
import * as actionTypes from '../actionTypes'
import { create_segmentId } from '../models'
import { LEVEL_PLAYBACK_TYPE } from '../constants'

//import awakeningSequencers from 'awakening-sequencers';
//const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;



//function shouldBePlaying (levelId, sessionPhase) {
  //if ([
    //SESSION_PHASES.IDLE,
    //SESSION_PHASES.TRANS_10,
    //SESSION_PHASES.PLAYING_ADVICE,
    //SESSION_PHASES.TRANS_IDLE
  //].includes(sessionPhase)) {
    //return false;
  //} else if ([
    //SESSION_PHASES.PLAYING_10,
    //SESSION_PHASES.TRANS_8
  //].includes(sessionPhase)) {
    //return (['level_10'].includes(levelId));
  //} else if (sessionPhase in [
    //SESSION_PHASES.PLAYING_8,
    //SESSION_PHASES.TRANS_6
  //]) {
    //return (['level_10', 'level_8'].includes(levelId));
  //} else if (sessionPhase in [
    //SESSION_PHASES.PLAYING_6,
    //SESSION_PHASES.TRANS_4
  //]) {
    //return (['level_10', 'level_8', 'level_6'].includes(levelId));
  //} else if ([
    //SESSION_PHASES.PLAYING_4,
    //SESSION_PHASES.ADVICE_READY
  //].includes(sessionPhase)) {
    //return true;
  //}
//}

//function level (state, action, sequencers) {
  //// if a button was pressed, this is the level id of the button press
  //let buttonLevelId;

  //switch (action.type) {
    //case actionTypes.SESSION_PHASE_ADVANCED:
      //if (
        //// if this level should be playing
        //shouldBePlaying(state.levelId, action.payload.phase)
      //) {
        //// if the level is not playing
        //if (state.playingState == PLAYING_STATES.STOPPED) {
          //// set level as queued
          //state.playingState = PLAYING_STATES.QUEUED;

          //// queue the levels first segment
          //state.activeSegmentIndex = 0;
          //state.activeSegmentId = state.segmentPlaybackOrder[
            //state.activeSegmentIndex
          //]
          //state.segments[state.activeSegmentId].playingState = (
            //PLAYING_STATES.QUEUED
          //);

          ////// queue the levels first sequencer
          ////state.activeSequencerIndex = 0;
          ////state.activeSequencerId = (
            ////state.sequencerPlaybackOrder[state.activeSequencerIndex]
          ////);
          ////let activeSequencer = sequencers[state.activeSequencerId];
          ////activeSequencer.playQuant = [
            ////activeSequencer.numBeats,
            ////0
          ////];
        //}

      //} else {
        //// this level shouldn't be playing
        //// TODO: test
        //if (state.playingState == PLAYING_STATES.PLAYING) {
          //console.log("TODO: stop the level");
          //// level gets STOP_QUEUED
          ////state.playingState = PLAYING_STATES.STOP_QUEUED;
          ////levelSequencers.forEach((sequencer) => {
            ////// all playing sequencers get STOP_QUEUED
            ////if (sequencer.playingState == PLAYING_STATES.PLAYING) {
              ////sequencer.playingState = PLAYING_STATES.STOP_QUEUED;
            ////} else {
              ////sequencer.playingState = PLAYING_STATES.STOPPED;
            ////}
          ////});
        //}

      //}
      //break;

    //case awakeningSequencers.actionTypes.SEQUENCER_STOPPED:
      //// a sequencer just stopped
      //// if we are queued to stop
      //if (state.playingState == PLAYING_STATES.STOP_QUEUED) {
        //// if it was one of our sequencers
        //if (state.sequencerIds.includes(action.payload.sequencerId)) {

          //// are all of our sequencers stopped now?
          //let allSequencersStopped = true;
          //levelSequencers.forEach((sequencer) => {
            //if (sequencer.playingState != PLAYING_STATES.STOPPED) {
              //allSequencersStopped = false;
            //}
          //});

          //if (allSequencersStopped) {
            //// consider our level to have stopped
            //state.playingState = PLAYING_STATES.STOPPED;
            //state.activeSequencerIndex = false;
          //}
        //}
      //}
      //break;
    
    //case awakeningSequencers.actionTypes.SEQUENCER_PLAYING:
      //// if it was one of our sequencers
      //if (state.sequencerIds.includes(action.payload.sequencerId)) {
        //// the sequencer that started playing is our activeSequencer
        //state.activeSequencerId = action.payload.sequencerId;

        //// if we just queued, we are definitely playing now
        //if (state.playingState == PLAYING_STATES.QUEUED) {
          //state.playingState = PLAYING_STATES.PLAYING;
        //} else {
          //// increment our active index
          //state.activeSequencerIndex = (
            //(state.activeSequencerIndex + 1) % state.numSegments
          //);
        //}

        //let activeSequencer = sequencers[state.activeSequencerId];

        //// queue the next sequencer
        //let nextSequencerIndex = (
          //(state.activeSequencerIndex + 1) % state.numSegments
        //);
        //let nextSequencerId = state.sequencerPlaybackOrder[nextSequencerIndex];
        //sequencers[nextSequencerId].playingState = PLAYING_STATES.QUEUED;
        //sequencers[nextSequencerId].playQuant = [activeSequencer.numBeats, 0];
      //}
      //break;
    
    //case actionTypes.BUTTON_PRESSED:
      //// if the press was for this level
      //buttonLevelId = `level_${action.payload.level}`;
      //if (buttonLevelId == state.levelId) {
        //// if this level is playing
        //if (state.playingState == PLAYING_STATES.PLAYING) {
          //let selectedSequencerId = (
            //`level_${action.payload.level}-segment_${action.payload.position}`
          //);
          //let selectedSequencerIndex = state.sequencerPlaybackOrder.indexOf(
            //selectedSequencerId
          //);
          //console.log("selectedSequencerId");
          //console.log(selectedSequencerId);
          //console.log("selectedSequencerIndex");
          //console.log(selectedSequencerIndex);

          //// stop queued sequencer
          //let nextSequencerIndex = (
            //(state.activeSequencerIndex + 1) % state.numSegments
          //);
          //let nextSequencerId = state.sequencerPlaybackOrder[
            //nextSequencerIndex
          //];
          
          //if (
            //selectedSequencerIndex == nextSequencerIndex ||
            //selectedSequencerIndex == state.activeSequencerIndex
          //) {
            //// do nothing
            //break;
          //} else {
            //// stop next sequencer
            //sequencers[nextSequencerId].playingState = PLAYING_STATES.STOPPED;

            //// swap selected sequencer with one that would have been next
            //state.sequencerPlaybackOrder[nextSequencerIndex] = (
              //selectedSequencerId
            //);
            //state.sequencerPlaybackOrder[selectedSequencerIndex] = (
              //nextSequencerId
            //);

            //// queue new next one
            //sequencers[selectedSequencerId].playingState = PLAYING_STATES.QUEUED;
            //let activeSequencer = sequencers[state.activeSequencerId];
            //sequencers[selectedSequencerId].playQuant = [
              //activeSequencer.numBeats,
              //0
            //];
          //}

        //}
      //}
      //break;
    //default:
      //break;
  //}
  //return state;
//}

//let levelNames = [
  //'level_10',
  ////'level_8',
  ////'level_6',
  ////'level_4',
  ////'level_2'
//];

function level (state, action, segments) {
  switch (action.type) {
    case actionTypes.BUTTON_PRESSED:
      state = Object.assign({}, state);
      if (state.playbackType === LEVEL_PLAYBACK_TYPE.SEQUENTIAL) {
        // assuming top-level controller that filtered only BUTTON_PRESSED
        // actions for this level
        let segmentId = create_segmentId(
          action.payload.levelId,
          action.payload.segmentIndex
        );
        if (state.segmentPlaybackIndex !== false) {
          state.segmentPlaybackOrder.splice(
            (state.segmentPlaybackIndex + 1) % state.numSegments,
            0,
            segmentId
          );
        } else {
          state.segmentPlaybackOrder.push(segmentId);
          state.segmentPlaybackIndex = 0;
        }
      }
      break;

    case awakeningSequencers.actionTypes.SEQUENCER_PLAYING:
      if (state.playbackType === LEVEL_PLAYBACK_TYPE.SEQUENTIAL) {
        if (state.segmentPlaybackIndex === false) {
          break;
        }
        let nextSegmentPlaybackIndex = (
          (state.segmentPlaybackIndex + 1) % state.segmentPlaybackOrder.length
        );

        // look at the segment that should be next
        let nextSegmentId = state.segmentPlaybackOrder[nextSegmentPlaybackIndex];
        let nextSegment = segments.byId[nextSegmentId];

        // is the sequencer for this segment ?
        if (nextSegment.sequencerId === action.payload.sequencerId) {
          // if so, our next segment has started playing
          state = Object.assign({}, state);
          state.segmentPlaybackIndex = nextSegmentPlaybackIndex;
        }
      }
      
      break;
    
    default:
      break;
  }
  return state;
}

function levelsById (state = {}, action, segments) {
  switch (action.type) {
    case actionTypes.BUTTON_PRESSED:
      let levelId = action.payload.levelId;
      let newLevel = level(state[levelId], action, segments);
      if (state[levelId] !== newLevel) {
        state = Object.assign({}, state);
        state[levelId] = newLevel;
      }
      break;

    default:
      let levelChanged = false;
      Object.keys(state).forEach((levelId) => {
        let newLevel = level(state[levelId], action, segments);
        if (newLevel !== state[levelId]) {
          state[levelId] = newLevel;
          levelChanged = true;
        }
      });
      if (levelChanged) {
        state = Object.assign({}, state);
      }
      break;
  }
  return state;
}

function levelsAllIds (state, action) {
  return state;
}

export default function (state = {byId: {}, allIds: []}, action, segments) {
  let newById = levelsById(state.byId, action, segments);
  let newAllIds = levelsAllIds(state.allIds, action);

  if (newById !== state.byId || newAllIds !== state.allIds) {
    state = {
      byId: newById,
      allIds: newAllIds
    };
  }

  return state;
}
