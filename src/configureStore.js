/**
 *  @file       configureStore.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/


import { createStore, combineReducers, applyMiddleware } from 'redux'

import { create_level, create_segment } from './models'
import abletonlinkRedux from 'abletonlink-redux'
import rootReducer from './reducers'

/**
 *  logging of state-store messages
 **/
const logger = store => next => action => {
  let now = new Date();
  console.info(`${now.toString()}: [OWA] dispatching`, action);
  console.log('prev state', JSON.stringify(store.getState(), ' ', 4))
  let result = next(action)
  console.log('next state', JSON.stringify(store.getState(), ' ', 4))
  return result
  //return next(action);
};
const middleware = [
];

if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

export function configureStore () {
  let createStoreWithMiddleware = applyMiddleware(
    ...middleware
  )(createStore);

  // create levels
  let levelsById = {
    //'level_10': create_level('level_10', 3),
    //'level_8': create_level('level_8', 8),
    'level_6': create_level('level_6', 6),
    'level_4': create_level('level_4', 4),
    'level_2': create_level('level_2', 2)
  };

  // create segments for each level
  let segmentsById = {};

  Object.keys(levelsById).forEach((levelId) => {
    let level = levelsById[levelId];

    let i;
    for (i = 0; i < level.numSegments; i++) {
      let newSegment = create_segment(level.levelId, i);
      segmentsById[newSegment.segmentId] = newSegment;
    }
  });

  let initialState = {
    levels: {
      byId: levelsById,
      allIds: Object.keys(levelsById)
    },
    segments: {
      byId: segmentsById,
      allIds: Object.keys(segmentsById)
    }
  };




  return createStoreWithMiddleware(rootReducer, initialState);
}

export function configureLinkStore () {
  let rootReducer = combineReducers({
    abletonlink: abletonlinkRedux.reducer
  });
  return createStore(rootReducer);
}
