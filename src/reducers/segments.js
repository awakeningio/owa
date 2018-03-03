/**
 *  @file       segments.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import * as actionTypes from '../actionTypes';
import { create_segmentId } from '../models';

function segment (state, action) {
  switch (action.type) {
    case actionTypes.BUTTON_PRESSED:
      // assuming sent from parent sequencer when button for this segment
      // is pressed
      //state = Object.assign({}, state);
      
      break;
    
    default:
      break;
  }
  return state;
}

function segmentsById (state, action) {
  switch (action.type) {
    case actionTypes.BUTTON_PRESSED:
      let segmentId = create_segmentId(
        action.payload.levelId,
        action.payload.segmentIndex
      );
      state = Object.assign({}, state);
      state[segmentId] = segment(state[segmentId], action);
      break;
    default:
      break;
  }
  return state;
}

function segmentsAllIds (state, action) {
  return state;
}

export default function (state = {byId: {}, allIds: []}, action) {
  let newById = segmentsById(state.byId, action);
  let newAllIds = segmentsAllIds(state.allIds, action);
  if (newById !== state.byId || newAllIds !== state.allIds) {
    return {
      byId: newById,
      allIds: newAllIds
    };
  }
  return state;
}
