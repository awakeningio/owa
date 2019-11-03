import { expect } from "chai";

import SCReduxSequencers from "supercollider-redux-sequencers";
import { OWA_READY_STATES, SESSION_PHASES } from "owa/constants";
import configureStore from "../src/configureStore";
import OWAController from "../src/OWAController";
import { create_segmentId } from "owa/models";
import { createInitialState } from "owa/state";
import { getSegmentIdToSequencerId } from "../src/selectors";
import * as actions from "../src/actions";

const PLAYING_STATES = SCReduxSequencers.PLAYING_STATES;

describe("Simultaneous Sequencer Playback", function() {
  var store, state, segment, sequencer, owaController;

  it("should init properly", function(done) {
    var unsub, soundReady;
    const initialState = createInitialState();
    initialState.sessionPhaseDurations[SESSION_PHASES.QUEUE_TRANS_6] = 2;
    initialState.sessionPhaseDurations[SESSION_PHASES.TRANS_6] = 2;
    store = configureStore(initialState);
    //abletonLinkStateStore = configureLinkStore();
    owaController = new OWAController(store, {
      disableInactivity: true
    });
    this.owaController = owaController;
    state = store.getState();
    soundReady = state.soundReady;

    unsub = store.subscribe(() => {
      state = store.getState();
      if (state.soundReady !== soundReady) {
        soundReady = state.soundReady;

        if (soundReady === OWA_READY_STATES.READY) {
          unsub();
          done();
        }
      }
    });
  });

  it("should have proper number of levels", function() {
    expect(state.levels.allIds.length).to.equal(3);
  });

  it("should have proper number of segments", function() {
    expect(state.segments.allIds.length).to.equal(12);
  });

  it("should be in IDLE phase", function() {
    expect(state.sessionPhase).to.equal(SESSION_PHASES.IDLE);
  });

  it("should not transition phase when level2 button is pressed", function() {
    store.dispatch(actions.buttonPressed("level_2", 0));
    state = store.getState();

    expect(state.sessionPhase).to.equal(SESSION_PHASES.IDLE);
  });

  // start testing level 6 (simultaneous)
  it("should immediately start transition when level6 button is pressed", function() {
    store.dispatch(actions.buttonPressed("level_6", 0));
    state = store.getState();
    expect(state.sessionPhase).to.equal(SESSION_PHASES.QUEUE_TRANS_6);
  });

  it("segment should have a sequencer", function() {
    segment = state.segments.byId[create_segmentId("level_6", 0)];
    const sequencerId = getSegmentIdToSequencerId(state)[segment.segmentId];
    sequencer = state.sequencers[sequencerId];
    expect(sequencer).to.not.be.undefined;
  });

  it("should set first segment sequencer to queue", function() {
    segment = state.segments.byId[create_segmentId("level_6", 0)];
    sequencer =
      state.sequencers[getSegmentIdToSequencerId(state)[segment.segmentId]];
    expect(sequencer.queueOnPhaseStart).to.equal(SESSION_PHASES.TRANS_6);
  });

  it("should queue on transition to TRANS_6", function(done) {
    const lastSessionPhase = state.sessionPhase;
    const sequencerId = getSegmentIdToSequencerId(state)[segment.segmentId];
    const unsub = store.subscribe(() => {
      const state = store.getState();
      if (state.sessionPhase !== lastSessionPhase) {
        expect(state.sessionPhase).to.equal(SESSION_PHASES.TRANS_6);
        expect(state.sequencers[sequencerId].playingState).to.equal(
          PLAYING_STATES.QUEUED
        );

        unsub();
        done();
      }
    });
  });

  it("should transition to playing on sessionPhase PLAYING_6", function(done) {
    let state = store.getState();
    const sequencerId = getSegmentIdToSequencerId(state)[segment.segmentId];
    let sessionPhase = state.sessionPhase;
    let playingState = state.sequencers[sequencerId].playingState;
    let i = 0;
    const unsub = store.subscribe(() => {
      state = store.getState();
      if (state.sessionPhase !== sessionPhase) {
        sessionPhase = state.sessionPhase;
        expect(state.sessionPhase).to.equal(SESSION_PHASES.PLAYING_6);
        i += 1;
      }

      if (state.sequencers[sequencerId].playingState !== playingState) {
        playingState = state.sequencers[sequencerId].playingState;
        expect(state.sequencers[sequencerId].playingState).to.equal(
          PLAYING_STATES.PLAYING
        );
        i += 1;
      }

      if (i === 2) {
        unsub();
        done();
      }
    });
  });

  it("should queue when another level6 button is pressed", function() {
    store.dispatch(actions.buttonPressed("level_6", 1));
    state = store.getState();
    segment = state.segments.byId[create_segmentId("level_6", 1)];
    const sequencerId = getSegmentIdToSequencerId(state)[segment.segmentId];
    sequencer = state.sequencers[sequencerId];
    expect(sequencer.playingState).to.equal(PLAYING_STATES.QUEUED);
  });

  it("should play second segment", function(done) {
    var unsub = store.subscribe(() => {
      state = store.getState();
      const sequencerId = getSegmentIdToSequencerId(state)[segment.segmentId];

      if (
        sequencer.playingState !== state.sequencers[sequencerId].playingState
      ) {
        sequencer = state.sequencers[sequencerId];
        expect(sequencer.playingState).to.equal(PLAYING_STATES.PLAYING);
        unsub();
        done();
      }
    });
  });

  it("should still be playing first segment", function() {
    segment = state.segments.byId[create_segmentId("level_6", 0)];
    const sequencerId = getSegmentIdToSequencerId(state)[segment.segmentId];
    sequencer = state.sequencers[sequencerId];
    expect(sequencer.playingState).to.equal(PLAYING_STATES.PLAYING);
  });

  it("should close down cleanly", function(done) {
    this.owaController
      .quit()
      .then(() => done())
      .catch(done);
  });
});
