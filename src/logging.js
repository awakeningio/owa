/**
 *  @file       logging.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { createLogger, format, transports } from "winston";

import { getEnvAsNumber } from "./utils";

const LOG_LEVEL = getEnvAsNumber("LOG_LEVEL");

var logger;

const logFormat = format.combine(
  format.timestamp(),
  format.printf(
    ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
  )
);

if (process.env.NODE_ENV === "development" || LOG_LEVEL === 1) {
  logger = createLogger({
    level: "debug",
    format: logFormat,
    transports: [
      new transports.File({
        level: "debug",
        filename: "combined.log"
      })
    ]
  });
  //logger.add(new transports.Console({
  //colorize: 'all',
  //format: format.simple()
  //}));
} else {
  logger = createLogger({
    level: "error",
    format: logFormat,
    transports: [
      new transports.File({
        level: "error",
        filename: "error.log"
      })
    ]
  });
}

/**
 *  logging of state-store messages
 **/
const stateTransformer = function(state) {
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
  //toPrint.sequencers = {
    //'eminator-6_0': {
      //playingState: state.sequencers['eminator-6_0'].playingState,
      //variationProps: state.sequencers['eminator-6_0'].variationProps,
      //variationMenuType: state.sequencers['eminator-6_0'].variationMenuType,
      //variationInteractionState: state.sequencers['eminator-6_0'].variationInteractionState,
      //currentVariationIndex: state.sequencers['eminator-6_0'].currentVariationIndex,
      //lastPropChangeQueuedAt: state.sequencers['eminator-6_0'].lastPropChangeQueuedAt,
      //lastPropChangeAt: state.sequencers['eminator-6_0'].lastPropChangeAt
    //}
  //};
  toPrint.soundReady = state.soundReady;
  toPrint.sessionPhase = state.sessionPhase;
  //toPrint.sessionPhaseDurations = state.sessionPhaseDurations;
  toPrint.idlePlayer = state.idlePlayer;
  toPrint.soundReady = state.soundReady;
  toPrint.songId = state.songId;
  toPrint.SCRedux = state.SCRedux;
  //toPrint.sequencers = state.sequencers;
  //toPrint.segments = state.segments;
  return toPrint;
};

export const storeLogger = store => next => action => {
  logger.info("action: " + JSON.stringify(action));
  const result = next(action);
  logger.info(
    "next state: " + JSON.stringify(stateTransformer(store.getState()), " ", 4)
  );
  return result;
};

export default logger;
