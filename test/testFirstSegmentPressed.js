/**
 *  @file       testFirstSegmentPressed.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { expect } from 'chai';

import configureStore from "../src/configureStore"

import { SESSION_PHASES } from '../src/constants';
import { buttonPressed, sessionPhaseAdvanced } from '../src/actions';
import { create_segmentId } from '../src/models';

describe('firstSegmentPressed', function () {
  var store = configureStore(),
    state = store.getState();

  it('should init to false', function () {
    expect(state.firstSegmentPressed).to.be.false;
  });

  it('should not update when level_4 button is pressed in idle', function () {
    expect(state.sessionPhase).to.equal(SESSION_PHASES.IDLE);

    store.dispatch(buttonPressed('level_4', 0));
    state = store.getState();
    expect(state.firstSegmentPressed).to.be.false;
  });

  let firstPressSegmentIndex = 0;
  let firstPressLevelId = 'level_6';
  let firstPressSegmentId = create_segmentId(
    firstPressLevelId,
    firstPressSegmentIndex
  );

  it('should update when level_6 button is pressed in idle mode', function () {
    expect(state.sessionPhase).to.equal(SESSION_PHASES.IDLE);

    store.dispatch(buttonPressed(firstPressLevelId, firstPressSegmentIndex));
    state = store.getState();

    expect(state.firstSegmentPressed).to.equal(firstPressSegmentId);
  });

  it('should remain constant while subsequent buttons are pressed', function () {
    store.dispatch(buttonPressed('level_4', 1));
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.PLAYING_6));
    store.dispatch(buttonPressed('level_6', 2));
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.TRANS_4));
    store.dispatch(buttonPressed('level_4', 1));
    state = store.getState();
    expect(state.firstSegmentPressed).to.equal(firstPressSegmentId);
  });

  it('should reset once transitioned back to idle', function () {
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.IDLE));
    state = store.getState();
    expect(state.firstSegmentPressed).to.be.false;
  });

});
