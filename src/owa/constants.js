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
  EMINATOR: 'eminator'
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

export const NUM_PIXELS = 168;

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

export const SHELL_PIXEL_RANGE = [144, 168];
export const SHELL_NUM_PYRAMIDS = 12;
export const SHELL_PIXELS_PER_PYRAMID = 2;
export const SHELL_PYRAMID_PIXEL_RANGES = new Array(SHELL_NUM_PYRAMIDS);
let i;
for (i = 0; i < SHELL_PYRAMID_PIXEL_RANGES.length; i++) {
  const startingPixel = SHELL_PIXEL_RANGE[0]+(SHELL_PIXELS_PER_PYRAMID * i);
  // list is filled backwards because pyramid is wired from the top but indexed
  // from the bottom
  SHELL_PYRAMID_PIXEL_RANGES[SHELL_NUM_PYRAMIDS - i - 1] = [startingPixel, startingPixel + SHELL_PIXELS_PER_PYRAMID];
}

export const BUTTON_ID_TO_LEVEL_SEGMENT = {
  "B00": ["level_2", 1],
  "B01": ["level_2", 0],
  "B02": ['level_4', 3],
  "B03": ['level_4', 2],
  "B04": ['level_4', 1],
  "B05": ['level_4', 0],
  "B06": ['level_6', 5],
  "B07": ['level_6', 4],
  "B08": ['level_6', 3],
  "B09": ['level_6', 2],
  "B10": ['level_6', 1],
  "B11": ['level_6', 0]
};

export const SEGMENTID_TO_PYRAMID_INDEX = {
  "level_6-segment_0": 0,
  "level_6-segment_1": 1,
  "level_6-segment_2": 2,
  "level_6-segment_3": 3,
  "level_6-segment_4": 4,
  "level_6-segment_5": 5,
  "level_4-segment_0": 6,
  "level_4-segment_1": 7,
  "level_4-segment_2": 8,
  "level_4-segment_3": 9,
  "level_2-segment_0": 10,
  "level_2-segment_1": 11
};

export const SEGMENTID_TO_SEQUENCERID_BY_SONGID = {
  [SONG_IDS.SPINNY_PLUCK]: {
    'level_6-segment_0': 'spinny_pluck-6_0',
    'level_6-segment_1': 'spinny_pluck-6_1',
    'level_6-segment_2': 'spinny_pluck-6_2',
    'level_6-segment_3': 'spinny_pluck-6_3',
    'level_6-segment_4': 'spinny_pluck-6_4',
    'level_6-segment_5': 'spinny_pluck-6_5',
    'level_4-segment_0': 'spinny_pluck-level_4',
    'level_4-segment_1': 'spinny_pluck-level_4',
    'level_4-segment_2': 'spinny_pluck-level_4',
    'level_4-segment_3': 'spinny_pluck-level_4',
    'level_2-segment_0': 'spinny_pluck-2_0',
    'level_2-segment_1': 'spinny_pluck-2_1'
  },
  [SONG_IDS.EMINATOR]: {
    'level_6-segment_0': 'eminator-6_0',
    'level_6-segment_1': 'eminator-6_1',
    'level_6-segment_2': 'eminator-6_2',
    'level_6-segment_3': 'eminator-6_3',
    'level_6-segment_4': 'eminator-6_4',
    'level_6-segment_5': 'eminator-6_5',
    'level_4-segment_0': 'eminator-level_4',
    'level_4-segment_1': 'eminator-level_4',
    'level_4-segment_2': 'eminator-level_4',
    'level_4-segment_3': 'eminator-level_4',
    'level_2-segment_0': 'eminator-2_0',
    'level_2-segment_1': 'eminator-2_1'
  }
};

export const REVEAL_SEQUENCERID_BY_SONGID = {
  [SONG_IDS.SPINNY_PLUCK]: 'spinny_pluck-reveal',
  [SONG_IDS.EMINATOR]: 'eminator-reveal'
};
export const TRANS_SEQUENCERID_BY_SONGID = {
  [SONG_IDS.SPINNY_PLUCK]: 'spinny_pluck-trans',
  [SONG_IDS.EMINATOR]: 'eminator-trans'
};

export const TEMPO_BY_SONGID = {
  [SONG_IDS.SPINNY_PLUCK]: 120.0,
  [SONG_IDS.EMINATOR]: 140.0
};

export const SESSION_PHASE_BEATS_PER_BAR_BY_SONGID = {
  [SONG_IDS.SPINNY_PLUCK]: {
    [SESSION_PHASES.QUEUE_TRANS_6]: 4,
    [SESSION_PHASES.TRANS_6]: 4,
    [SESSION_PHASES.QUEUE_TRANS_4]: 4,
    [SESSION_PHASES.TRANS_4]: 4,
    [SESSION_PHASES.QUEUE_TRANS_2]: 4,
    [SESSION_PHASES.TRANS_2]: 4,
    [SESSION_PHASES.PLAYING_2]: 4,
    [SESSION_PHASES.QUEUE_TRANS_ADVICE]: 4,
    [SESSION_PHASES.TRANS_ADVICE]: 4,
    [SESSION_PHASES.PLAYING_ADVICE]: 4
  },
  [SONG_IDS.EMINATOR]: {
    [SESSION_PHASES.QUEUE_TRANS_6]: 7,
    [SESSION_PHASES.TRANS_6]: 7,
    [SESSION_PHASES.QUEUE_TRANS_4]: 7,
    [SESSION_PHASES.TRANS_4]: 4,
    [SESSION_PHASES.QUEUE_TRANS_2]: 4,
    [SESSION_PHASES.TRANS_2]: 4,
    [SESSION_PHASES.PLAYING_2]: 4,
    [SESSION_PHASES.QUEUE_TRANS_ADVICE]: 4,
    [SESSION_PHASES.TRANS_ADVICE]: 4,
    [SESSION_PHASES.PLAYING_ADVICE]: 4
  }
};

export const SESSION_PHASE_DURATIONS_BY_SONGID = {
  [SONG_IDS.SPINNY_PLUCK]: {
    [SESSION_PHASES.QUEUE_TRANS_6]: 4,
    [SESSION_PHASES.TRANS_6]: 15 * 4,
    [SESSION_PHASES.QUEUE_TRANS_4]: 4,
    [SESSION_PHASES.TRANS_4]: 4 * 4,
    [SESSION_PHASES.QUEUE_TRANS_2]: 4,
    [SESSION_PHASES.TRANS_2]: 4 * 4,
    [SESSION_PHASES.PLAYING_2]: 8,
    [SESSION_PHASES.QUEUE_TRANS_ADVICE]: 4,
    [SESSION_PHASES.TRANS_ADVICE]: 6 * 4,
    [SESSION_PHASES.PLAYING_ADVICE]: 55 * 4
  },
  [SONG_IDS.EMINATOR]: {
    [SESSION_PHASES.QUEUE_TRANS_6]: 7,
    [SESSION_PHASES.TRANS_6]: 21 * 7,
    //[SESSION_PHASES.TRANS_6]: 2 * 7,
    [SESSION_PHASES.QUEUE_TRANS_4]: 7 * 2,
    [SESSION_PHASES.TRANS_4]: 8 * 4,
    [SESSION_PHASES.QUEUE_TRANS_2]: 4,
    [SESSION_PHASES.TRANS_2]: 7 * 4,
    [SESSION_PHASES.PLAYING_2]: 8,
    [SESSION_PHASES.QUEUE_TRANS_ADVICE]: 4 * 4,
    [SESSION_PHASES.TRANS_ADVICE]: 5 * 4,
    [SESSION_PHASES.PLAYING_ADVICE]: 112 * 4
  }
};

export const VARIATION_MENU_TYPES = {
  NONE: "VARIATION_MENU_TYPE_NONE",
  SECTIONS: "VARIATION_MENU_TYPE_SECTIONS",
  INCREASING: "VARIATION_MENU_TYPE_INCREASING",
  SUBDIVISIONS: "VARIATION_MENU_TYPE_SUBDIVISIONS"
};

export const VARIATION_INTERACTION_STATES = {
  NONE: "VARIATION_INTERACTION_STATE_NONE",
  CHOOSING: "VARIATION_INTERACTION_STATE_CHOOSING",
  CHOSEN: "VARIATION_INTERACTION_STATE_CHOSEN"
};
