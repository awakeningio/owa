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
  NOT_BOOTED: "NOT_BOOTED",
  BOOTING: "BOOTING",
  BOOTED: "BOOTED",
  READY: "READY"
};

export const CONNECTION_STATUS = {
  DISCONNECTED: "DISCONNECTED",
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED"
};

export const LEVEL_PLAYBACK_TYPE = {
  SIMULTANEOUS: "SIMULTANEOUS",
  SEQUENTIAL: "SEQUENTIAL"
};

export const SONG_IDS = {
  SPINNY_PLUCK: 'spinny_pluck',
  //EMINATOR: 'eminator'
};

export const SONG_IDS_LIST = Object.keys(SONG_IDS).map(k => SONG_IDS[k]);

const IDLE = "IDLE";
const QUEUE_TRANS_6 = "QUEUE_TRANS_6";
const TRANS_6 = "TRANS_6";
const PLAYING_6 = "PLAYING_6";
const QUEUE_TRANS_4 = "QUEUE_TRANS_4";
const TRANS_4 = "TRANS_4";
const PLAYING_4 = "PLAYING_4";
const QUEUE_TRANS_2 = "QUEUE_TRANS_2";
const TRANS_2 = "TRANS_2";
const PLAYING_2 = "PLAYING_2";
const QUEUE_TRANS_ADVICE = "QUEUE_TRANS_ADVICE";
const TRANS_ADVICE = "TRANS_ADVICE";
const PLAYING_ADVICE = "PLAYING_ADVICE";
export const SESSION_PHASES = {
  IDLE,
  QUEUE_TRANS_6,
  TRANS_6,
  PLAYING_6,
  QUEUE_TRANS_4,
  TRANS_4,
  PLAYING_4,
  QUEUE_TRANS_2,
  TRANS_2,
  PLAYING_2,
  QUEUE_TRANS_ADVICE,
  TRANS_ADVICE,
  PLAYING_ADVICE
};

export const NEXT_SESSION_PHASES = {
  IDLE: QUEUE_TRANS_6,
  QUEUE_TRANS_6: TRANS_6,
  TRANS_6: PLAYING_6,
  PLAYING_6: QUEUE_TRANS_4,
  QUEUE_TRANS_4: TRANS_4,
  TRANS_4: PLAYING_4,
  PLAYING_4: QUEUE_TRANS_2,
  QUEUE_TRANS_2: TRANS_2,
  TRANS_2: PLAYING_2,
  PLAYING_2: QUEUE_TRANS_ADVICE,
  QUEUE_TRANS_ADVICE: TRANS_ADVICE,
  TRANS_ADVICE: PLAYING_ADVICE,
  PLAYING_ADVICE: IDLE
};

export const AUTO_TRANS_SESSION_PHASES = [
  QUEUE_TRANS_6,
  TRANS_6,
  QUEUE_TRANS_4,
  TRANS_4,
  QUEUE_TRANS_2,
  TRANS_2,
  QUEUE_TRANS_ADVICE,
  TRANS_ADVICE,
  PLAYING_ADVICE
];

// pixel address ranges and their respective names.
export const SEGMENTID_TO_PIXEL_RANGE = {
  "level_6-segment_0": [0, 12],
  "level_6-segment_1": [12, 24],
  "level_6-segment_2": [24, 36],
  "level_6-segment_3": [36, 48],
  "level_6-segment_4": [48, 60],
  "level_6-segment_5": [60, 72],
  "level_4-segment_0": [72, 84],
  "level_4-segment_1": [84, 96],
  "level_4-segment_2": [96, 108],
  "level_4-segment_3": [108, 120],
  "level_2-segment_0": [120, 132],
  "level_2-segment_1": [132, 144]
};

export const LEVELID_TO_PIXEL_RANGE = {
  'level_2': [120, 144],
  'level_4': [72, 120],
  'level_6': [0, 72]
};

export const BUTTON_ID_TO_LEVEL_SEGMENT = {
  "00": ["level_2", 1],
  "01": ["level_2", 0],
  "02": ['level_4', 3],
  "03": ['level_4', 2],
  "04": ['level_4', 1],
  "05": ['level_4', 0],
  "06": ['level_6', 5],
  "07": ['level_6', 4],
  "08": ['level_6', 3],
  "09": ['level_6', 2],
  "10": ['level_6', 1],
  "11": ['level_6', 0]
};
