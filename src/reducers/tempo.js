import {
  SESSION_PHASE_ADVANCED
} from '../actionTypes';
import {
  getSongId
} from '../selectors';
import {
  TEMPO_BY_SONGID,
  SONG_IDS_LIST,
  SESSION_PHASES
} from 'owa/constants';

const firstSongTempo = TEMPO_BY_SONGID[SONG_IDS_LIST[0]];
export default function tempo (state = firstSongTempo, action, fullState) {
  switch (action.type) {
    case SESSION_PHASE_ADVANCED:
      // If we've just transitioned back to idle mode, the song
      // has changed.
      if (action.payload.phase === SESSION_PHASES.IDLE) {
        const songId = getSongId(fullState);
        return TEMPO_BY_SONGID[songId];
      } else {
        return state;
      }
    default:
      return state;
  }
}
