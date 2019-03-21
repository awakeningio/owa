import { expect } from 'chai';

import awakeningSequencers from 'awakening-sequencers';
import { OWA_READY_STATES, SESSION_PHASES } from 'owa/constants'
import configureStore from "../src/configureStore"
import OWAController from "../src/OWAController"
import { create_segmentId } from 'owa/models'
import { createInitialState } from 'owa/state';
import { getSegmentIdToSequencerId } from '../src/selectors';
import * as actions from '../src/actions'

const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

describe("Simultaneous Sequencer Playback", function () {
  var store, state, segment, sequencer, owaController;

  it("should init properly", function (done) {
    var unsub, soundReady;
    const initialState = createInitialState()
    initialState.sessionPhaseDurations[SESSION_PHASES.QUEUE_TRANS_6] = 2;
    initialState.sessionPhaseDurations[SESSION_PHASES.TRANS_6] = 2;
    store = configureStore(initialState);
    //abletonLinkStateStore = configureLinkStore();
    owaController = new OWAController(store, {});
    this.owaController = owaController;
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
  });

  it("should have proper number of levels", function () {
    expect(state.levels.allIds.length).to.equal(3);
  });

  it("should have proper number of segments", function () {
    expect(state.segments.allIds.length).to.equal(12);
  });

  it("should be in IDLE phase", function () {
    expect(state.sessionPhase).to.equal(SESSION_PHASES.IDLE);
  });

  it("should not transition phase when level2 button is pressed", function () {
    store.dispatch(actions.buttonPressed('level_2', 0));
    state = store.getState();

    expect(state.sessionPhase).to.equal(SESSION_PHASES.IDLE);
  });

  // start testing level 6 (simultaneous)
  it("should immediately start transition when level6 button is pressed", function () {
    store.dispatch(actions.buttonPressed('level_6', 0));
    state = store.getState();
    expect(state.sessionPhase).to.equal(SESSION_PHASES.QUEUE_TRANS_6);
  });

  it("segment should have a sequencer", function () {
    segment = state.segments.byId[create_segmentId('level_6', 0)];
    sequencer = state.sequencers[
      getSegmentIdToSequencerId(state)[segment.segmentId]
    ];
    expect(sequencer).to.not.be.undefined;
  });
  
  it("should have queued first segment sequencer", function () {
    segment = state.segments.byId[create_segmentId('level_6', 0)];
    sequencer = state.sequencers[
      getSegmentIdToSequencerId(state)[segment.segmentId]
    ];
    expect(sequencer.playingState).to.equal(PLAYING_STATES.QUEUED)
  });

  it("sessionPhase should eventually transition to playing", function (done) {
    let sessionPhase = store.getState().sessionPhase;
    const sessionPhaseSequence = [
      SESSION_PHASES.TRANS_6,
      SESSION_PHASES.PLAYING_6
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


  it("should play first segment", function (done) {
    var unsub = store.subscribe(() => {
      state = store.getState();

      if (sequencer.playingState !== state.sequencers[
        getSegmentIdToSequencerId(state)[segment.segmentId]
      ].playingState) {
        sequencer = state.sequencers[
          getSegmentIdToSequencerId(state)[segment.segmentId]
        ];
        expect(sequencer.playingState).to.equal(PLAYING_STATES.PLAYING);
        unsub();
        done();
      }

    });
  });
  
  it("should queue when another level6 button is pressed", function () {
    store.dispatch(actions.buttonPressed('level_6', 1));
    state = store.getState();
    segment = state.segments.byId[create_segmentId('level_6', 1)];
    sequencer = state.sequencers[
      getSegmentIdToSequencerId(state)[segment.segmentId]
    ];
    expect(sequencer.playingState).to.equal(PLAYING_STATES.QUEUED);
  });
  
  it("should play second segment", function (done) {
    var unsub = store.subscribe(() => {
      state = store.getState();
      
      if (sequencer.playingState !== state.sequencers[
        getSegmentIdToSequencerId(state)[segment.segmentId]
      ].playingState) {
        sequencer = state.sequencers[
          getSegmentIdToSequencerId(state)[segment.segmentId]
        ];
        expect(sequencer.playingState).to.equal(PLAYING_STATES.PLAYING);
        unsub();
        done();
      }

    });
  });

  it("should still be playing first segment", function () {
    segment = state.segments.byId[create_segmentId('level_6', 0)];
    sequencer = state.sequencers[getSegmentIdToSequencerId(state)[segment.segmentId]];
    expect(sequencer.playingState).to.equal(PLAYING_STATES.PLAYING);
  });
  
  it("should close down cleanly", function (done) {
    this.owaController.quit().then(() => done()).catch(done);
  });
});
