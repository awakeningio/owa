import { expect } from 'chai';

import { PLAYING_STATES } from 'awakening-sequencers';
import { OWA_READY_STATES, SESSION_PHASES } from '../src/constants'
import {configureStore, configureLinkStore} from "../src/configureStore"
import OWAController from "../src/OWAController"
import { create_segmentId } from '../src/models'
import * as actions from '../src/actions'

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
  it("should transition when level6 button is pressed", function () {
    store.dispatch(actions.buttonPressed(level.levelId, 0));
    state = store.getState();
    expect(state.sessionPhase).to.equal(SESSION_PHASES.TRANS_6);
  });

  var segment, sequencer;
  it("segment should have a sequencer", function () {
    segment = state.segments.byId[create_segmentId(level.levelId, 0)];
    sequencer = state.sequencers[segment.sequencerId];
    expect(sequencer).to.not.be.false;
  });

  it("should have queued segment sequencer", function () {
    expect(sequencer.playingState).to.equal(PLAYING_STATES.QUEUED);
  });

  it("level should have updated playback order", function () {
    expect(level.segmentPlaybackOrder).to.deep.equal([segment.segmentId]);
  });

  it("should have transitioned to playing", function () {
    expect(state.sessionPhase).to.equal(SESSION_PHASES.PLAYING_6);
  });
 
  var secondSegment = state.segments.byId[create_segmentId(level.levelId, 1)];
  it("should not transition on button press", function () {
    store.dispatch(actions.buttonPressed(level.levelId, 1));
    state = store.getState();
    expect(state.sessionPhase).to.equal(SESSION_PHASES.PLAYING_6);
  });

  it("level should have updated playback order", function () {
    expect(level.segmentPlaybackOrder).to.deep.equal([segment.segmentId, secondSegment.segmentId]);
  });
  


  it("should close down cleanly", function (done) {
    owaController.quit().then(() => {
      done();
      process.exit(0);
    }).catch((err) => {
      done(err);
      process.exit(1);
    });
  });

});
