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
import awakeningSequencers from 'awakening-sequencers';
import supercolliderRedux from 'supercollider-redux';

import configureStore from "../src/configureStore";
import { getSCState } from '../src/selectors'

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
    let prevState = state;

    store.dispatch(awakeningSequencers.actions.sequencerQueued('6_0'));
    
    state = store.getState();
    scState = getSCState(state);

    expect(state).to.not.equal(prevState);
    expect(state.sequencers).to.not.equal(prevState.sequencers);
    expect(state.sequencers['6_0']).to.not.equal(prevState.sequencers['6_0']);
    expect(state.sequencers).to.not.equal(prevState.sequencers);

    expect(scState).to.not.equal(prevSCState);

    prevSCState = scState;
    store.dispatch(
      awakeningSequencers.actions.sequencerPlaying('6_0')
    );
    state = store.getState();
    scState = getSCState(state);
    
    expect(scState).to.not.equal(prevSCState);
    
  });

  it("should remain the same on sequencer playback", function () {
    let prevSCState = scState;
    let prevState = state;
    
    store.dispatch({
      type: supercolliderRedux.actionTypes.SUPERCOLLIDER_EVENTSTREAMPLAYER_NEXTBEAT,
      payload: {
        id: '6_0',
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
