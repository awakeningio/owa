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
//import { create_segmentId } from '../models';
import { SESSION_PHASES } from '../constants';

function segment (state, action, prevSessionPhase, sessionPhase) {
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
    case actionTypes.SESSION_PHASE_ADVANCED:

      switch (sessionPhase) {
        case SESSION_PHASES.TRANS_6:
          return Object.assign(
            {},
            state,
            {
              sequencerProps: Object.assign(
                {},
                state.sequencerProps,
                state.phaseSequencerProps[SESSION_PHASES.PLAYING_6]
              )
            }
          );
        case SESSION_PHASES.TRANS_4:
          return Object.assign(
            {},
            state,
            {
              sequencerProps: Object.assign(
                {},
                state.sequencerProps,
                state.phaseSequencerProps[SESSION_PHASES.PLAYING_4]
              )
            }
          );
        case SESSION_PHASES.TRANS_2:
          return Object.assign(
            {},
            state,
            {
              sequencerProps: Object.assign(
                {},
                state.sequencerProps,
                state.phaseSequencerProps[SESSION_PHASES.PLAYING_2]
              )
            }
          );
        default:
          return state;
      }
      // assuming sent from parent sequencer when button for this segment
      // is pressed
      //state = Object.assign({}, state);
      
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

export default function (state = {byId: {}, allIds: []}, action, prevSessionPhase, sessionPhase) {
  state.allIds.forEach(function (segmentId) {
    let seg = segment(
      state.byId[segmentId],
      action,
      prevSessionPhase,
      sessionPhase
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
