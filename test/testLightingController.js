import { expect } from 'chai';

import LightingController from '../src/LightingController.js'

import configureStore from "../src/configureStore"

import awakeningSequencers from 'awakening-sequencers'

describe("LightingController", function () {
  var store = configureStore();
  var lightingController;

  it("should init", function (done) {
    lightingController = new LightingController(store);
    done();
  });

  it("should have a SegmentLightingController for each segment", function (done) {
    let state = store.getState();
    expect(lightingController.segmentLightingControllers.length).to.equal(
      state.segments.allIds.length
    );
    done();
  });

  it("should switch to queued animation when sequencer is queued", function (done) {
    let sequencerId = '6_0';

    store.dispatch(awakeningSequencers.actions.sequencerQueued(sequencerId));

    setTimeout(done, 4000);
  });

  it("should switch to playing animation when sequencer is playing", function (done) {
    store.dispatch(awakeningSequencers.actions.sequencerPlaying('6_0'));

    setTimeout(done, 4000);
  });
  
  it("should switch to queued animation when sequencer is queued again", function (done) {
    let sequencerId = '6_0';

    store.dispatch(awakeningSequencers.actions.sequencerQueued(sequencerId));

    setTimeout(done, 4000);
  });
});
