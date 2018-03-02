/**
 *  @file       segments.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

function segment (state, action) {
  return state;
}

function segmentsById (state, action) {
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
