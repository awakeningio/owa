/**
 *  @file       testSCState.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/
import { expect } from 'chai';
import SCReduxSequencers from 'supercollider-redux-sequencers';
import supercolliderRedux from 'supercollider-redux';

import configureStore from "../src/configureStore";
import { getSCState, getLevel6Sequencers } from '../src/selectors'

describe('SCState', function () {
  var store,
    state,
    scState;
  
  it("should select a subset of state", function () {
    store = configureStore();
    state = store.getState();
    scState = getSCState(state);

    expect(state).to.have.property('levels');
    expect(scState).to.not.have.property('levels');
  });

  it("should change when a sequencer is queued", function () {
    let prevSCState = scState;
    const prevState = state;
    const prevLevel6Sequencers = getLevel6Sequencers(state);

    store.dispatch(
      SCReduxSequencers.actions.sequencerQueued(
        prevLevel6Sequencers[0].sequencerId
      )
    );
    
    state = store.getState();
    scState = getSCState(state);
    const level6Sequencers = getLevel6Sequencers(state);

    expect(state).to.not.equal(prevState);
    expect(state.sequencers).to.not.equal(prevState.sequencers);
    expect(prevLevel6Sequencers[0]).to.not.equal(level6Sequencers[0]);

    expect(scState).to.not.equal(prevSCState);

    prevSCState = scState;
    store.dispatch(
      SCReduxSequencers.actions.sequencerPlaying(
        prevLevel6Sequencers[0].sequencerId
      )
    );
    state = store.getState();
    scState = getSCState(state);
    
    expect(scState).to.not.equal(prevSCState);
    
  });

  it("should remain the same on sequencer playback", function () {
    const prevSCState = scState;
    const prevState = state;
    const level6Sequencers = getLevel6Sequencers(state);
    
    store.dispatch({
      type: supercolliderRedux.actionTypes.SUPERCOLLIDER_EVENTSTREAMPLAYER_NEXTBEAT,
      payload: {
        id: level6Sequencers[0].sequencerId,
        nextTime: 1,
        nextBeat: 1,
        midinote: 44
      }
    });
    
    state = store.getState();
    scState = getSCState(state);

    expect(state).to.not.equal(prevState);
    expect(scState).to.equal(prevSCState);
  });
});
