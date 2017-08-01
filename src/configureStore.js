/**
 *  @file       configureStore.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/


import { createStore, combineReducers, applyMiddleware } from 'redux'

import owa from './reducers/owa'
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

export function configureStore (initialState = {}) {
  let rootReducer = combineReducers({
    owa: owa
  });
  let createStoreWithMiddleware = applyMiddleware(
    logger
  )(createStore);


  return createStoreWithMiddleware(rootReducer, initialState);
}

export function configureLinkStore () {
  let rootReducer = combineReducers({
    abletonlink: abletonlinkRedux.reducer
  });
  return createStore(rootReducer);
}
