/**
 *  @file       configureStore.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/


import { createStore, applyMiddleware } from 'redux'
import { createInitialState } from 'owa/state';


import logger from './logging'

//import abletonlinkRedux from 'abletonlink-redux'
import rootReducer from './reducers'
//import { getLevel6Sequencers } from './selectors';
const middleware = [
];

if (process.env.NODE_ENV === 'development') {
  /**
   *  logging of state-store messages
   **/
  const stateTransformer = function (state) {
    const toPrint = {};
    //toPrint.sequencers = state.sequencers;
    //Object.keys(state.sequencers).forEach(function (seqId) {
      //toPrint.sequencers[seqId] = _.pick(state.sequencers[seqId], [
        //'type',
        //'playingState',
        //'playQuant',
        //'stopQuant',
        //'event',
        //'bufSequence'
      //])
    //});
    toPrint.sessionPhase = state.sessionPhase;
    //toPrint.sessionPhaseDurations = state.sessionPhaseDurations;
    toPrint.idlePlayer = state.idlePlayer;
    toPrint.soundReady = state.soundReady;
    //toPrint.sequencers = state.sequencers;
    //toPrint.segments = state.segments;
    return toPrint;
  };
  const storeLogger = store => next => action => {
    logger.info('action: ' + JSON.stringify(action));
    const result = next(action);
    logger.info('next state: ' + JSON.stringify(stateTransformer(store.getState()), ' ', 4));
    return result;
  };
  middleware.push(storeLogger);
}

export default function configureStore (additionalInitialState = {}) {
  const createStoreWithMiddleware = applyMiddleware(
    ...middleware
  )(createStore);

  const initialState = {...createInitialState(), ...additionalInitialState};

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
