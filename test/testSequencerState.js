import { expect } from 'chai';

import awakeningSequencers from 'awakening-sequencers';
import { OWA_READY_STATES, SESSION_PHASES } from '../src/constants'
import {configureStore, configureLinkStore} from "../src/configureStore"
import OWAController from "../src/OWAController"
import { create_segmentId } from '../src/models'
import * as actions from '../src/actions'

const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

describe("Sequencer States", function () {
  var store = configureStore();
  var abletonLinkStateStore = configureLinkStore();
  var owaController = new OWAController(store, {
    linkStateStore: abletonLinkStateStore
  });
  var state = store.getState();

  it("should init properly", function (done) {
    var unsub, soundReady = null;

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

  var level = state.levels.byId['level_6'];
  it("should immediately transition when level6 button is pressed", function () {
    store.dispatch(actions.buttonPressed(level.levelId, 0));
    state = store.getState();
    expect(state.sessionPhase).to.equal(SESSION_PHASES.TRANS_6);
  });

  var segment, sequencer;
  it("segment should have a sequencer", function () {
    segment = state.segments.byId[create_segmentId(level.levelId, 0)];
    expect(segment.sequencerId, "sequencerId of segment '${segment.segmentId}'")
      .to.not.be.false;
    sequencer = state.sequencers[segment.sequencerId];
    expect(sequencer).to.not.be.undefined;
  });

  var sessionPhase;
  it("should eventually transition to playing", function (done) {
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

  it("level should point to the proper segment", function () {
    level = state.levels.byId['level_6'];
    expect(level.segmentPlaybackIndex).to.equal(0);
  });

  it("should have queued segment sequencer", function () {
    expect(sequencer.playingState).to.equal(PLAYING_STATES.QUEUED);
  });

  it("level should have updated playback order", function () {
    expect(level.segmentPlaybackOrder).to.deep.equal([segment.segmentId]);
  });
  
  it("level should point to the proper segment", function () {
    level = state.levels.byId['level_6'];
    expect(level.segmentPlaybackIndex).to.equal(0);
  });

  var secondSegment;
  it("should not transition on button press", function () {
    secondSegment = state.segments.byId[create_segmentId(level.levelId, 1)];
    store.dispatch(actions.buttonPressed(level.levelId, 1));
    state = store.getState();
    expect(state.sessionPhase).to.equal(SESSION_PHASES.PLAYING_6);
  });

  it("level should have updated playback order", function () {
    expect(level.segmentPlaybackOrder).to.deep.equal([segment.segmentId, secondSegment.segmentId]);
  });

  var secondSequencer;
  it("sequencer for second segment should be queued", function () {
    secondSequencer = state.sequencers[secondSegment.sequencerId];
    expect(secondSequencer.playingState).to.equal(PLAYING_STATES.QUEUED);
  });

  it("second sequencer should start playing & first should be queued", function (done) {
    state = store.getState();
    secondSequencer = state.sequencers[secondSegment.sequencerId];
    let unsub = store.subscribe(() => {
      state = store.getState();
      if (state.sequencers[secondSegment.sequencerId].playingState !== secondSequencer.playingState) {
        secondSequencer = state.sequencers[secondSegment.sequencerId];
        sequencer = state.sequencers[segment.sequencerId];
        expect(secondSequencer.playingState).to.equal(PLAYING_STATES.PLAYING);
        expect(sequencer.playingState).to.equal(PLAYING_STATES.QUEUED);
        unsub();
        done();
      }
    });
  });
  
  it("level should point to the proper segment", function () {
    level = state.levels.byId['level_6'];
    expect(level.segmentPlaybackIndex).to.equal(1);
  });

  it("first should start and second should be queued", function (done) {
    let unsub = store.subscribe(() => {
      state = store.getState();
      if (state.sequencers[segment.sequencerId].playingState !== sequencer.playingState) {
        secondSequencer = state.sequencers[secondSegment.sequencerId];
        sequencer = state.sequencers[segment.sequencerId];
        expect(secondSequencer.playingState).to.equal(PLAYING_STATES.QUEUED);
        expect(sequencer.playingState).to.equal(PLAYING_STATES.PLAYING);
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