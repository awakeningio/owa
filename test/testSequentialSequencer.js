import { expect } from 'chai';

//import awakeningSequencers from 'awakening-sequencers';
import { OWA_READY_STATES, SESSION_PHASES } from 'owa/constants'
import configureStore from "../src/configureStore"
import OWAController from "../src/OWAController"
import { create_segmentId } from 'owa/models'
import { createInitialState } from 'owa/state';
//import { getLevel6Sequencers } from '../src/selectors';
import * as actions from '../src/actions'

//const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

describe("Sequential Sequencer", function () {
  var store, state, segment, sequencer, level, secondSegment;

  it("should init properly", function (done) {
    var unsub, soundReady;
    const initialState = createInitialState()
    

    //const level6Sequencers = getLevel6Sequencers(initialState);
    //level6Sequencers.forEach(seq => seq.playingState = PLAYING_STATES.PLAYING);

    initialState.sessionPhaseDurations[SESSION_PHASES.QUEUE_TRANS_4] = 2;
    initialState.sessionPhaseDurations[SESSION_PHASES.TRANS_4] = 2;
    
    store = configureStore({...initialState, ...{
      sessionPhase: SESSION_PHASES.PLAYING_6,
      level4Ready: true,
      //sequencers: {
        //...initialState.sequencers,
        //...level6Sequencers.reduce((acc, seq) => {
          //acc[seq.sequencerId] = seq;
          //return acc
        //}, {})
      //}
    }});
    //abletonLinkStateStore = configureLinkStore();
    state = store.getState();
    soundReady = state.soundReady;

    unsub = store.subscribe(() => {
      state = store.getState();
      if (state.soundReady !== soundReady) {
        soundReady = state.soundReady;

        if (soundReady === OWA_READY_STATES.READY) {
          unsub();
          done();
        }
      }
    });
    this.owaController = new OWAController(store, {
      //linkStateStore: abletonLinkStateStore
    });
  });
  
  // start testing level 4
  it("should immediately start transition when level4 button is pressed", function () {
    level = state.levels.byId['level_4'];
    store.dispatch(actions.buttonPressed(level.levelId, 0));
    state = store.getState();
    segment = state.segments.byId[create_segmentId(level.levelId, 0)];
    sequencer = state.sequencers[segment.sequencerId];
    expect(state.sessionPhase).to.equal(SESSION_PHASES.QUEUE_TRANS_4);
  });
  
  it("sequencer should have updated playback order on button press", function () {
    level = state.levels.byId['level_4'];
    segment = state.segments.byId[create_segmentId(level.levelId, 0)];
    sequencer = state.sequencers[segment.sequencerId];
    expect(sequencer).to.have.property('bufSequence');
    expect(sequencer.bufSequence).to.be.a('array');
    expect(sequencer.bufSequence).to.have.lengthOf(1);
    expect(sequencer.bufSequence[0]).to.equal(
      segment.phaseSequencerProps[SESSION_PHASES.PLAYING_4].bufName
    );
  });

  it('should transition to PLAYING_4', function (done) {
    let sessionPhase = store.getState().sessionPhase;
    const sessionPhaseSequence = [
      SESSION_PHASES.TRANS_4,
      SESSION_PHASES.PLAYING_4
    ];
    let i = 0;
    const unsub = store.subscribe(() => {
      const state = store.getState();
      if (state.sessionPhase !== sessionPhase) {
        sessionPhase = state.sessionPhase;
        expect(sessionPhase).to.equal(sessionPhaseSequence[i]);
        i += 1;
        if (i === sessionPhaseSequence.length) {
          unsub();
          done();
        }
      }
    });
  });
  
  it("should not transition sessionPhase on button press", function () {
    secondSegment = state.segments.byId[create_segmentId(level.levelId, 1)];
    store.dispatch(actions.buttonPressed(level.levelId, 1));
    state = store.getState();
    level = state.levels.byId['level_4'];
    sequencer = state.sequencers[segment.sequencerId];
    expect(secondSegment.sequencerId).to.equal(segment.sequencerId);
    expect(state.sessionPhase).to.equal(SESSION_PHASES.PLAYING_4);
  });

  it("should have updated playback order because button press", function () {
    expect(sequencer.bufSequence).to.have.lengthOf(2);
    expect(sequencer.bufSequence[0]).to.equal(
      secondSegment.phaseSequencerProps[SESSION_PHASES.PLAYING_4].bufName
    );
    expect(sequencer.bufSequence[1]).to.equal(
      segment.phaseSequencerProps[SESSION_PHASES.PLAYING_4].bufName
    );
  });

  it("should close down cleanly", function (done) {
    this.owaController.quit().then(() => done()).catch(done);
  });
});
