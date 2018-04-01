/**
 *  @file       constants.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

export const OWA_READY_STATES = {
  BOOTING: "BOOTING",
  BOOTED: "BOOTED",
  READY: "READY"
};

export const LEVEL_PLAYBACK_TYPE = {
  SIMULTANEOUS: "SIMULTANEOUS",
  SEQUENTIAL: "SEQUENTIAL"
};

const IDLE = "IDLE";
//const TRANS_10 = "TRANS_10";
//const PLAYING_10 = "PLAYING_10";
//const TRANS_8 = "TRANS_8";
//const PLAYING_8 = "PLAYING_8";
const TRANS_6 = "TRANS_6";
const PLAYING_6 = "PLAYING_6";
const TRANS_4 = "TRANS_4";
const PLAYING_4 = "PLAYING_4";
const TRANS_2 = "TRANS_2";
const PLAYING_2 = "PLAYING_2";
const ADVICE_READY = "ADVICE_READY";
const TRANS_ADVICE = "TRANS_ADVICE";
const PLAYING_ADVICE = "PLAYING_ADVICE";
const TRANS_IDLE = "TRANS_IDLE";
export const SESSION_PHASES = {
  IDLE,
  //TRANS_10,
  //PLAYING_10,
  //TRANS_8,
  //PLAYING_8,
  TRANS_6,
  PLAYING_6,
  TRANS_4,
  PLAYING_4,
  TRANS_2,
  PLAYING_2,
  ADVICE_READY,
  TRANS_ADVICE,
  PLAYING_ADVICE,
  TRANS_IDLE
};

export const NEXT_SESSION_PHASES = {
  // our prototype only has levels 6, 4, 2
  IDLE: TRANS_6,
  //TRANS_10: PLAYING_10,
  //PLAYING_10: TRANS_8,
  //TRANS_8: PLAYING_8,
  //PLAYING_8: TRANS_6,
  TRANS_6: PLAYING_6,
  PLAYING_6: TRANS_4,
  TRANS_4: PLAYING_4,
  PLAYING_4: TRANS_2,
  TRANS_2: PLAYING_2,
  PLAYING_2: ADVICE_READY,
  ADVICE_READY: TRANS_ADVICE,
  TRANS_ADVICE: PLAYING_ADVICE,
  PLAYING_ADVICE: TRANS_IDLE,
  TRANS_IDLE: IDLE
};

export const TRANS_PHASE_DURATIONS = {
  //TRANS_10,
  //TRANS_8,
  TRANS_6: 12,
  TRANS_4: 16,
  TRANS_2: 16,
  TRANS_ADVICE: 16,
  TRANS_IDLE: 16
};
