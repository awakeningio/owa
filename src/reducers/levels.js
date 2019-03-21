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
function level (state, action) {
  switch (action.type) {
    case actionTypes.BUTTON_PRESSED:
      //state = Object.assign({}, state);
      //if (state.playbackType === LEVEL_PLAYBACK_TYPE.SEQUENTIAL) {
        //// assuming top-level controller that filtered only BUTTON_PRESSED
        //// actions for this level
        //let segmentId = create_segmentId(
          //action.payload.levelId,
          //action.payload.segmentIndex
        //);
        //if (state.segmentPlaybackIndex !== false) {
          //state.segmentPlaybackOrder.splice(
            //(state.segmentPlaybackIndex + 1) % state.numSegments,
            //0,
            //segmentId
          //);
        //} else {
          //state.segmentPlaybackOrder.push(segmentId);
          //state.segmentPlaybackIndex = 0;
        //}
      //}
      break;

    case awakeningSequencers.actionTypes.SEQUENCER_PLAYING:
      //if (state.playbackType === LEVEL_PLAYBACK_TYPE.SEQUENTIAL) {
        //if (state.segmentPlaybackIndex === false) {
          //break;
        //}
        //let nextSegmentPlaybackIndex = (
          //(state.segmentPlaybackIndex + 1) % state.segmentPlaybackOrder.length
        //);

        //// look at the segment that should be next
        //let nextSegmentId = state.segmentPlaybackOrder[nextSegmentPlaybackIndex];
        //let nextSegment = segments.byId[nextSegmentId];

      //// is the sequencer for this segment ?
      //// TODO: if this code is used again, note `sequencerId` has been
      //removed from segment.
        //if (nextSegment.sequencerId === action.payload.sequencerId) {
          //// if so, our next segment has started playing
          //state = Object.assign({}, state);
          //state.segmentPlaybackIndex = nextSegmentPlaybackIndex;
        //}
      //}
      
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
  switch (action.type) {
    default:
      return state;
  }
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
