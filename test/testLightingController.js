import { expect } from 'chai';

import LightingController from '../src/LightingController.js'

import configureStore from "../src/configureStore"

import awakeningSequencers from 'awakening-sequencers'

describe("LightingController", function () {
  const store = configureStore();
  const state = store.getState();
  const sequencerId = Object.keys(state.sequencers)[0];
  var lightingController;

  it("should init", function () {
    lightingController = new LightingController(store);
  });

  it("should have a SegmentLightingController for each segment", function (done) {
    const state = store.getState();
    expect(lightingController.segmentLightingControllers.length).to.equal(
      state.segments.allIds.length
    );
    done();
  });

  it("should switch to queued animation when sequencer is queued", function (done) {
    store.dispatch(awakeningSequencers.actions.sequencerQueued(sequencerId));

    setTimeout(done, 4000);
  });

  it("should switch to playing animation when sequencer is playing", function (done) {
    store.dispatch(awakeningSequencers.actions.sequencerPlaying(sequencerId));

    setTimeout(done, 4000);
  });
  
  it("should switch to queued animation when sequencer is queued again", function (done) {
    store.dispatch(awakeningSequencers.actions.sequencerQueued(sequencerId));

    setTimeout(done, 4000);
  });

  it('should quit', function () {
    lightingController.quit();
  });
});
