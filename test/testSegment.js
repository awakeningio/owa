/**
 *  @file       testSegment.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { expect } from 'chai';

import configureStore from '../src/configureStore';

import { buttonPressed } from '../src/actions';
import { create_segmentId } from 'owa/models';

describe('segment', function () {
  var store = configureStore(),
    state = store.getState(),
    segmentId = create_segmentId('level_6', 0),
    segment,
    lastButtonPressTime;

  it('should init lastButtonPressTime', function () {
    segment = state.segments.byId[segmentId];
    expect(segment.lastButtonPressTime).to.equal(0);
  });

  it('should update lastButtonPressTime when button is pressed', function () {
    store.dispatch(buttonPressed('level_6', 0));
    state = store.getState();
    expect(state.segments.byId[segmentId]).to.not.equal(segment);
    segment = state.segments.byId[segmentId];
    lastButtonPressTime = segment.lastButtonPressTime;

    expect(lastButtonPressTime).to.not.equal(0);
  });

  it('should update again when button is pressed', function (done) {
    const oldLastButtonPressTime = lastButtonPressTime;
    setTimeout(function () {
      store.dispatch(buttonPressed('level_6', 0));
      state = store.getState();
      expect(state.segments.byId[segmentId]).to.not.equal(segment);
      segment = state.segments.byId[segmentId];
      lastButtonPressTime = segment.lastButtonPressTime;

      expect(lastButtonPressTime).to.not.equal(oldLastButtonPressTime);
      done();
    }, 100);
  });

  it('should not update when another button is pressed', function () {
    store.dispatch(buttonPressed('level_6', 1));
    state = store.getState();

    expect(state.segments.byId[segmentId]).to.equal(segment);
    expect(state.segments.byId[segmentId].lastButtonPressTime).to.equal(
      lastButtonPressTime
    );

  });
});
