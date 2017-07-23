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

/**
 *  logging of state-store messages
 **/
const logger = store => next => action => {
  let now = new Date();
  console.info(`${now.toString()}: [OWA] dispatching`, action);
  //let result = next(action)
  console.log('next state', JSON.stringify(store.getState()))
  //console.groupEnd(action.type)
  //return result
  return next(action);
};

export default function configureStore (initialState = {}) {
  let rootReducer = combineReducers({
    owa
  });
  let createStoreWithMiddleware = applyMiddleware(
    logger
  )(createStore);


  return createStoreWithMiddleware(rootReducer, initialState);
}
