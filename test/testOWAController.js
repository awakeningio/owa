import { expect } from 'chai';

import {configureStore, configureLinkStore} from "../src/configureStore"
import { OWA_READY_STATES } from "../src/constants"
import OWAController from "../src/OWAController"

describe("OWAController", function () {
  var store = configureStore();
  var abletonLinkStateStore = configureLinkStore();
  var owaController;

  it("should initialize without failure", function (done) {
    var state = store.getState();
    var soundReady = state.soundReady;
    var unsub;

    owaController = new OWAController(store, {
      linkStateStore: abletonLinkStateStore
    });
    
    unsub = store.subscribe(() => {
      state = store.getState();

      if (state.soundReady !== soundReady) {
        soundReady = state.soundReady;
       
        if (state.soundReady === OWA_READY_STATES.BOOTED) {
          expect(state.soundReady).to.equal(OWA_READY_STATES.BOOTED);
          unsub();

          unsub = store.subscribe(() => {
            if (state.soundReady !== soundReady) {
              expect(state.soundReady).to.equal(OWA_READY_STATES.READY);
              unsub();
              done();
            }
          });
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
