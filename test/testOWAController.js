import { expect } from 'chai';

import configureStore from "../src/configureStore"
import { OWA_READY_STATES } from "owa/constants"
import OWAController from "../src/OWAController"

describe("OWAController", function () {
  var store = configureStore();
  //var abletonLinkStateStore = configureLinkStore();
  var owaController;

  it("should initialize without failure", function (done) {
    const soundReadySequence = [
      OWA_READY_STATES.BOOTED,
      OWA_READY_STATES.READY
    ];

    var i = 0;
    var state = store.getState();
    var soundReady = state.soundReady;
    
    owaController = new OWAController(store, {
      //linkStateStore: abletonLinkStateStore
    });
    
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
  });

  it("should close down cleanly", function (done) {
    owaController.quit().then(() => {
      done();
    }).catch((err) => {
      done(err);
    });
  });

});
