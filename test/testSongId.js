/**
 *  @file       testSongId.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2019 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { expect } from "chai";
import configureStore from "../src/configureStore";
import { createInitialState } from "owa/state";
import { sessionPhaseAdvanced } from "../src/actions";
import { getSongId } from "../src/selectors";
import { SONG_IDS_LIST, SESSION_PHASES } from "owa/constants";

describe("songId", function() {
  it("should not change when phase advances", function() {
    const initialState = createInitialState();
    initialState.sessionPhase = SESSION_PHASES.QUEUE_TRANS_6;
    const store = configureStore(initialState);
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.TRANS_6));
    const songId = getSongId(store.getState());
    expect(songId).to.equal(initialState.songId);
  });

  it("should go to next song when phase advances back to idle mode", function() {
    const initialState = createInitialState();
    initialState.sessionPhase = SESSION_PHASES.PLAYING_ADVICE;
    const store = configureStore(initialState);
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.IDLE));
    const songId = getSongId(store.getState());
    expect(songId).to.equal(
      SONG_IDS_LIST[
        (SONG_IDS_LIST.indexOf(initialState.songId) + 1) % SONG_IDS_LIST.length
      ]
    );
  });

  it("should wrap back around to first song when at the last one", function() {
    const initialState = createInitialState();
    initialState.songId = SONG_IDS_LIST[SONG_IDS_LIST.length - 1];
    initialState.sessionPhase = SESSION_PHASES.PLAYING_ADVICE;
    const store = configureStore(initialState);
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.IDLE));
    const songId = getSongId(store.getState());
    expect(songId).to.equal(SONG_IDS_LIST[0]);
  });
});
