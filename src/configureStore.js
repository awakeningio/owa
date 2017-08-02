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
import awakeningSequencers from "awakening-sequencers"

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

function create_initial_state () {
  return {
    sequencers: {
      'level_10-segment_0': awakeningSequencers.create_default_sequencer(
        'level_10-segment_0',
        'simple'
      )
    }
  };
}

export function configureStore (initialState = create_initial_state()) {
  let rootReducer = combineReducers({
    sequencers: awakeningSequencers.reducer,
    owa: owa,
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
