/**
 *  @file       testSegment.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { expect } from "chai";

import configureStore from "../src/configureStore";

import { buttonPressed } from "../src/actions";
import { create_segmentId } from "owa/models";
import {
  getButtonSequencers,
  getSegmentIdToSequencerId
} from "../src/selectors";

describe("owaSequencer reducer", function() {
  var store = configureStore(),
    state = store.getState(),
    sequencers = getButtonSequencers(state),
    segmentId = create_segmentId("level_6", 0),
    sequencer,
    lastButtonPressTime;

  it("should init lastButtonPressTime", function() {
    sequencers.forEach(seq => expect(seq.lastButtonPressTime).to.equal(0));
  });

  it("should update lastButtonPressTime when button is pressed", function() {
    const segmentIdToSequencerId = getSegmentIdToSequencerId(state);
    const sequencerId = segmentIdToSequencerId[segmentId];
    sequencer = state.sequencers[sequencerId];
    store.dispatch(buttonPressed("level_6", 0));
    state = store.getState();
    expect(state.sequencers[sequencerId]).to.not.equal(sequencer);
    sequencer = state.sequencers[sequencerId];
    lastButtonPressTime = sequencer.lastButtonPressTime;
    expect(lastButtonPressTime).to.not.equal(0);
  });

  it("should update again when button is pressed", function(done) {
    const segmentIdToSequencerId = getSegmentIdToSequencerId(state);
    const sequencerId = segmentIdToSequencerId[segmentId];
    const oldLastButtonPressTime = lastButtonPressTime;
    setTimeout(function() {
      sequencer = state.sequencers[sequencerId];
      store.dispatch(buttonPressed("level_6", 0));
      state = store.getState();
      expect(state.sequencers[sequencerId]).to.not.equal(sequencer);
      sequencer = state.sequencers[sequencerId];
      lastButtonPressTime = sequencer.lastButtonPressTime;

      expect(lastButtonPressTime).to.not.equal(oldLastButtonPressTime);
      done();
    }, 100);
  });

  it("should not update when another button is pressed", function() {
    const segmentIdToSequencerId = getSegmentIdToSequencerId(state);
    const sequencerId = segmentIdToSequencerId[segmentId];
    sequencer = state.sequencers[sequencerId];
    store.dispatch(buttonPressed("level_6", 1));
    state = store.getState();

    expect(state.sequencers[sequencerId]).to.equal(sequencer);
    expect(state.sequencers[sequencerId].lastButtonPressTime).to.equal(
      lastButtonPressTime
    );
  });
});
