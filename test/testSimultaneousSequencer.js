import { expect } from 'chai';

import awakeningSequencers from 'awakening-sequencers';
import { OWA_READY_STATES, SESSION_PHASES } from '../src/constants'
import {configureStore, configureLinkStore} from "../src/configureStore"
import OWAController from "../src/OWAController"
import { create_segmentId } from '../src/models'
import * as actions from '../src/actions'

const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

describe("Simultaneous Sequencer Playback", function () {
  var store, abletonLinkStateStore, state, segment,
    sequencer, sessionPhase, owaController;

  it("should init properly", function (done) {
    var unsub, soundReady;
    store = configureStore();
    abletonLinkStateStore = configureLinkStore();
    owaController = new OWAController(store, {
      linkStateStore: abletonLinkStateStore
    });
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

  it("should have proper number of levels", function () {
    expect(state.levels.allIds.length).to.equal(3);
  });

  it("should have proper number of segments", function () {
    expect(state.segments.allIds.length).to.equal(12);
  });

  it("should be in IDLE phase", function () {
    expect(state.sessionPhase).to.equal(SESSION_PHASES.IDLE);
  });

  it("should not transition phase when level2 button is pressed", function () {
    store.dispatch(actions.buttonPressed('level_2', 0));
    state = store.getState();

    expect(state.sessionPhase).to.equal(SESSION_PHASES.IDLE);
  });

  // start testing level 6 (simultaneous)
  it("should immediately start transition when level6 button is pressed", function () {
    store.dispatch(actions.buttonPressed('level_6', 0));
    state = store.getState();
    expect(state.sessionPhase).to.equal(SESSION_PHASES.TRANS_6);
  });

  it("segment should have a sequencer", function () {
    segment = state.segments.byId[create_segmentId('level_6', 0)];
    expect(segment.sequencerId, "sequencerId of segment '${segment.segmentId}'")
      .to.not.be.false;
    sequencer = state.sequencers[segment.sequencerId];
    expect(sequencer).to.not.be.undefined;
  });
  
  it("should have queued first segment sequencer", function () {
    segment = state.segments.byId[create_segmentId('level_6', 0)];
    sequencer = state.sequencers[segment.sequencerId];
    expect(sequencer.playingState).to.equal(PLAYING_STATES.QUEUED)
  });

  it("sessionPhase should eventually transition to playing", function (done) {
    state = store.getState();
    sessionPhase = state.sessionPhase;
    let unsub = store.subscribe(() => {
      state = store.getState();
      if (sessionPhase !== state.sessionPhase) {
        sessionPhase = state.sessionPhase;

        expect(sessionPhase).to.equal(SESSION_PHASES.PLAYING_6);
        unsub();
        done();
      }
    });
  });


  it("should play first segment", function (done) {
    var unsub = store.subscribe(() => {
      state = store.getState();
      
      if (sequencer.playingState !== state.sequencers[segment.sequencerId].playingState) {
        sequencer = state.sequencers[segment.sequencerId];
        expect(sequencer.playingState).to.equal(PLAYING_STATES.PLAYING);
        unsub();
        done();
      }

    });
  });
  
  it("should queue when another level6 button is pressed", function () {
    store.dispatch(actions.buttonPressed('level_6', 1));
    state = store.getState();
    segment = state.segments.byId[create_segmentId('level_6', 1)];
    sequencer = state.sequencers[segment.sequencerId];
    expect(sequencer.playingState).to.equal(PLAYING_STATES.QUEUED);
  });
  
  it("should play second segment", function (done) {
    var unsub = store.subscribe(() => {
      state = store.getState();
      
      if (sequencer.playingState !== state.sequencers[segment.sequencerId].playingState) {
        sequencer = state.sequencers[segment.sequencerId];
        expect(sequencer.playingState).to.equal(PLAYING_STATES.PLAYING);
        unsub();
        done();
      }

    });
  });

  it("should still be playing first segment", function () {
    segment = state.segments.byId[create_segmentId('level_6', 0)];
    sequencer = state.sequencers[segment.sequencerId];
    expect(sequencer.playingState).to.equal(PLAYING_STATES.PLAYING);
  });
  
  it("should stop sequencer when level6 button is pressed again", function () {
    store.dispatch(actions.buttonPressed('level_6', 0));
    state = store.getState();
    segment = state.segments.byId[create_segmentId('level_6', 0)];
    sequencer = state.sequencers[segment.sequencerId];
    expect(sequencer.playingState).to.equal(PLAYING_STATES.STOP_QUEUED);
  });

  it("should stop first segment", function (done) {
    var unsub = store.subscribe(() => {
      state = store.getState();
      
      if (sequencer.playingState !== state.sequencers[segment.sequencerId].playingState) {
        sequencer = state.sequencers[segment.sequencerId];
        expect(sequencer.playingState).to.equal(PLAYING_STATES.STOPPED);
        unsub();
        done();
      }

    });
  });
  
  it("should close down cleanly", function (done) {
    owaController.quit().then(() => {
      done();
    }).catch((err) => {
      done(err);
    });
  });
});
