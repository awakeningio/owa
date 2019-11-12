import { expect } from 'chai';

import configureStore from "../src/configureStore"
import { OWA_READY_STATES } from "owa/constants"
import OWAController from "../src/OWAController"

describe("OWAController", function () {
  var store = configureStore();

  it("should initialize without failure", function (done) {
    const soundReadySequence = [
      OWA_READY_STATES.BOOTING,
      OWA_READY_STATES.BOOTED,
      OWA_READY_STATES.READY
    ];

    var i = 0;
    var state = store.getState();
    var soundReady = state.soundReady;
    
    store.subscribe(() => {
      state = store.getState();

      if (state.soundReady !== soundReady) {
        soundReady = state.soundReady;
        expect(state.soundReady).to.equal(soundReadySequence[i]);
        i += 1;
        if (i === soundReadySequence.length) {
          done();
        }
      }
    });
    this.owaController = new OWAController(store, {});

  });

  it("should close down cleanly", function (done) {
    this.owaController.quit().then(done).catch(done);
  });

});
