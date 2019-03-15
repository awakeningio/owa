/**
 *  @file       songId.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2019 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import {
  SESSION_PHASES,
  SONG_IDS_LIST
} from 'owa/constants';
import { SESSION_PHASE_ADVANCED } from '../actionTypes';

export default function songId (state = SONG_IDS_LIST[0], action) {
  switch (action.type) {
    case SESSION_PHASE_ADVANCED:
      if (action.payload.phase === SESSION_PHASES.IDLE) {
        const currentSongIndex = SONG_IDS_LIST.indexOf(state);
        return SONG_IDS_LIST[(currentSongIndex + 1) % SONG_IDS_LIST.length]
      } else {
        return state;
      }
    default:
      return state;
  }
}
