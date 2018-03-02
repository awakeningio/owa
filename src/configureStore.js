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

export function configureStore (initialState = {}) {
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
