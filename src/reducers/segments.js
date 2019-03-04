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

function segment (state, action) {
  switch (action.type) {
    case actionTypes.BUTTON_PRESSED:
      // if button press was for this segment
      if (
        action.payload.levelId === state.levelId
        && action.payload.segmentIndex === state.segmentIndex
      ) {
        // update lastButtonPressTime
        return Object.assign({}, state, {
          lastButtonPressTime: (new Date()).getTime()
        });
      } else {
        return state;
      }
    default:
      break;
  }
  return state;
}

//function segmentsById (state, action) {
  //switch (action.type) {
    //case actionTypes.BUTTON_PRESSED:
      //let segmentId = create_segmentId(
        //action.payload.levelId,
        //action.payload.segmentIndex
      //);
      //state = Object.assign({}, state);
      //state[segmentId] = segment(state[segmentId], action);
      //break;
    //default:
      //break;
  //}
  //return state;
//}

//function segmentsAllIds (state, action) {
  //return state;
//}

export default function (state = {byId: {}, allIds: []}, action) {
  state.allIds.forEach(function (segmentId) {
    const seg = segment(
      state.byId[segmentId],
      action
    );
    if (seg !== state.byId[segmentId]) {
      state = {
        allIds: state.allIds,
        byId: Object.assign({}, state.byId, {
          [segmentId]: seg
        })
      };
    }
  });
  return state;
}
