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

import * as reducers from './reducers'
import abletonlinkRedux from 'abletonlink-redux'

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
  //logger
];

export function configureStore (initialState = {}) {
  let rootReducer = function (state, action) {
    state.soundReady = reducers.soundReady(state.soundReady, action);
    state.sessionPhase = reducers.sessionPhase(state.sessionPhase, action);
    state.sequencers = reducers.sequencers(state.sequencers, action);
    state.levels = reducers.levels(state.levels, action, state.sequencers);
    return state;
  };
  let createStoreWithMiddleware = applyMiddleware(
    ...middleware
  )(createStore);


  return createStoreWithMiddleware(rootReducer, initialState);
}

export function configureLinkStore () {
  let rootReducer = combineReducers({
    abletonlink: abletonlinkRedux.reducer
  });
  return createStore(rootReducer);
}
