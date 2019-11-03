import { expect } from 'chai';
import sinon from 'sinon';

import SCReduxSequencers from 'supercollider-redux-sequencers'

import LightingController from '../src/LightingController.js'
import configureStore from "../src/configureStore"
import { SESSION_PHASES } from 'owa/constants';
import {
  sessionPhaseAdvanced,
} from '../src/actions';
import { getSegmentIdToSequencerId } from '../src/selectors';


describe("LightingController", function () {
  const store = configureStore();
  const state = store.getState();
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

  it("should switch to queued animation when next sequencer is queued", function () {
    const segmentTwo = state.segments.byId[state.segments.allIds[1]];
    const segmentLightingController = (
      lightingController.segmentLightingControllers.find(function (controller) {
        return controller.params.segmentId == segmentTwo.segmentId;
      })
    );
    segmentLightingController.queuedAnimation.start = sinon.fake();
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.PLAYING_6));
    store.dispatch(SCReduxSequencers.actions.sequencerQueued(
        getSegmentIdToSequencerId(store.getState())[
          segmentTwo.segmentId
        ]
    ));

    expect(
      segmentLightingController.queuedAnimation.start.callCount
    ).to.equal(1);
  });

  it('should quit', function () {
    lightingController.quit();
  });
});
