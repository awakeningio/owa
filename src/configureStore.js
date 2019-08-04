/**
 *  @file       configureStore.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { createStore, applyMiddleware } from "redux";
import { createInitialState } from "owa/state";
import { getEnvAsNumber } from "./utils";

import { storeLogger } from "./logging";

//import abletonlinkRedux from 'abletonlink-redux'
import rootReducer from "./reducers";
//import { getLevel6Sequencers } from './selectors';

const LOG_LEVEL = getEnvAsNumber("LOG_LEVEL");

const middleware = [storeLogger];

export default function configureStore(additionalInitialState = {}) {
  const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);

  const initialState = { ...createInitialState(), ...additionalInitialState };

  //initialState.sessionPhase = SESSION_PHASES.PLAYING_6;
  //initialState.sequencers['6_1'].playingState = PLAYING_STATES.QUEUED;

  return createStoreWithMiddleware(rootReducer, initialState);
}

//export function configureLinkStore () {
//const rootReducer = combineReducers({
//abletonlink: abletonlinkRedux.reducer
//});
//const middleware = [];
////if (process.env.NODE_ENV === 'development') {
////middleware.push(createLogger());
////}
//return createStore(rootReducer, applyMiddleware(...middleware));
//}
