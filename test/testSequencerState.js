import { expect } from 'chai';

import { OWA_READY_STATES, SESSION_PHASES } from '../src/constants'
import {configureStore, configureLinkStore} from "../src/configureStore"
import OWAController from "../src/OWAController"
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

  it("should have proper segment playback order", function () {
    expect(state.levels.byId['level_2'].segmentPlaybackOrder).to.deep.equal([0, 1]);
  });

  it("should be in IDLE phase", function () {
    expect(state.sessionPhase).to.equal(SESSION_PHASES.IDLE);
  });

  it("should not transition phase when level2 button is pressed", function () {
    store.dispatch(actions.buttonPressed('level_2', 0));
    state = store.getState();

    expect(state.sessionPhase).to.equal(SESSION_PHASES.IDLE);
  });

  it("should transition when level6 button is pressed", function () {
    store.dispatch(actions.buttonPressed('level_6', 0));
    state = store.getState();
    expect(state.sessionPhase).to.equal(SESSION_PHASES.TRANS_6);
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
