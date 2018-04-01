import { expect } from 'chai';

import awakeningSequencers from 'awakening-sequencers';
import { OWA_READY_STATES, SESSION_PHASES } from '../src/constants'
import {configureStore, configureLinkStore} from "../src/configureStore"
import OWAController from "../src/OWAController"
import { create_segmentId } from '../src/models'
import * as actions from '../src/actions'

const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

describe("Sequencer States", function () {
  var store, abletonLinkStateStore, owaController, state, level, segment,
    sequencer, sessionPhase, secondSegment, secondSequencer;

  it("should init properly", function (done) {
    var unsub, soundReady = null;
    store = configureStore();
    abletonLinkStateStore = configureLinkStore();
    owaController = new OWAController(store, {
      linkStateStore: abletonLinkStateStore
    });
    state = store.getState();

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
    level = state.levels.byId['level_6'];
    store.dispatch(actions.buttonPressed(level.levelId, 0));
    state = store.getState();
    expect(state.sessionPhase).to.equal(SESSION_PHASES.TRANS_6);
  });

  it("segment should have a sequencer", function () {
    segment = state.segments.byId[create_segmentId(level.levelId, 0)];
    expect(segment.sequencerId, "sequencerId of segment '${segment.segmentId}'")
      .to.not.be.false;
    sequencer = state.sequencers[segment.sequencerId];
    expect(sequencer).to.not.be.undefined;
  });
  
  it("should have queued first segment sequencer", function () {
    level = state.levels.byId['level_6'];
    segment = state.segments.byId[create_segmentId(level.levelId, 0)];
    sequencer = state.sequencers[segment.sequencerId];
    expect(sequencer.playingState).to.equal(PLAYING_STATES.QUEUED)
  });

  it("should eventually transition to playing", function (done) {
    state = store.getState();
    sessionPhase = state.sessionPhase;
    let unsub = store.subscribe(() => {
      state = store.getState();
      if (sessionPhase !== state.sessionPhase) {
        sessionPhase = state.sessionPhase;

        expect(sessionPhase).to.equal(SESSION_PHASES.PLAYING_6);
        unsub();
        done();
      }
    });
  });


  it("should play first segment", function (done) {
    var unsub = store.subscribe(() => {
      state = store.getState();
      
      if (sequencer.playingState !== state.sequencers[segment.sequencerId].playingState) {
        sequencer = state.sequencers[segment.sequencerId];
        expect(sequencer.playingState).to.equal(PLAYING_STATES.PLAYING);
        unsub();
        done();
      }

    });
  });
  
  it("should queue when another level6 button is pressed", function () {
    store.dispatch(actions.buttonPressed(level.levelId, 1));
    state = store.getState();
    segment = state.segments.byId[create_segmentId(level.levelId, 1)];
    sequencer = state.sequencers[segment.sequencerId];
    expect(sequencer.playingState).to.equal(PLAYING_STATES.QUEUED);
  });
  
  it("should play second segment", function (done) {
    var unsub = store.subscribe(() => {
      state = store.getState();
      
      if (sequencer.playingState !== state.sequencers[segment.sequencerId].playingState) {
        sequencer = state.sequencers[segment.sequencerId];
        expect(sequencer.playingState).to.equal(PLAYING_STATES.PLAYING);
        unsub();
        done();
      }

    });
  });

  it("should still be playing first segment", function () {
    segment = state.segments.byId[create_segmentId(level.levelId, 0)];
    sequencer = state.sequencers[segment.sequencerId];
    expect(sequencer.playingState).to.equal(PLAYING_STATES.PLAYING);
  });
  
  it("should stop sequencer when level6 button is pressed again", function () {
    store.dispatch(actions.buttonPressed(level.levelId, 0));
    state = store.getState();
    segment = state.segments.byId[create_segmentId(level.levelId, 0)];
    sequencer = state.sequencers[segment.sequencerId];
    expect(sequencer.playingState).to.equal(PLAYING_STATES.STOP_QUEUED);
  });

  it("should stop first segment", function (done) {
    var unsub = store.subscribe(() => {
      state = store.getState();
      
      if (sequencer.playingState !== state.sequencers[segment.sequencerId].playingState) {
        sequencer = state.sequencers[segment.sequencerId];
        expect(sequencer.playingState).to.equal(PLAYING_STATES.STOPPED);
        unsub();
        done();
      }

    });
  });

  // start testing level 4
  it("should immediately start transition when level4 button is pressed", function () {
    level = state.levels.byId['level_4'];
    store.dispatch(actions.buttonPressed(level.levelId, 0));
    state = store.getState();
    expect(state.sessionPhase).to.equal(SESSION_PHASES.TRANS_4);
  });
  
  it("should eventually transition to playing", function (done) {
    state = store.getState();
    sessionPhase = state.sessionPhase;
    let unsub = store.subscribe(() => {
      state = store.getState();
      if (sessionPhase !== state.sessionPhase) {
        sessionPhase = state.sessionPhase;

        expect(sessionPhase).to.equal(SESSION_PHASES.PLAYING_4);
        unsub();
        done();
      }
    });
  });

  it("level 4 should point to segment 0", function () {
    level = state.levels.byId['level_4'];
    segment = state.segments.byId[create_segmentId(level.levelId, 0)];
    sequencer = state.sequencers[segment.sequencerId];
    expect(level).to.have.property('segmentPlaybackIndex');
    expect(level.segmentPlaybackIndex).to.equal(0);
  });

  it("should have queued segment sequencer", function () {
    expect(sequencer.playingState).to.equal(PLAYING_STATES.QUEUED);
  });

  it("level should have updated playback order", function () {
    expect(level).to.have.property('segmentPlaybackOrder');
    expect(level.segmentPlaybackOrder).to.deep.equal([segment.segmentId]);
  });
  
  it("level should point to segment 0", function () {
    expect(level.segmentPlaybackIndex).to.equal(0);
  });

  it("should not transition sessionPhase on button press", function () {
    secondSegment = state.segments.byId[create_segmentId(level.levelId, 1)];
    store.dispatch(actions.buttonPressed(level.levelId, 1));
    state = store.getState();
    level = state.levels.byId['level_4'];
    expect(state.sessionPhase).to.equal(SESSION_PHASES.PLAYING_4);
  });

  it("should have updated playback order", function () {
    expect(level.segmentPlaybackOrder).to.deep.equal([
      segment.segmentId,
      secondSegment.segmentId
    ]);
  });

  it("index should be the same", function () {
    expect(level.segmentPlaybackIndex).to.equal(0);
  });

  it("sequencer for second segment should be queued for the first time", function () {
    secondSequencer = state.sequencers[secondSegment.sequencerId];
    expect(secondSequencer.playingState).to.equal(PLAYING_STATES.QUEUED);
  });

  it("second sequencer should start playing & first should be queued", function (done) {
    state = store.getState();
    secondSequencer = state.sequencers[secondSegment.sequencerId];
    let unsub = store.subscribe(() => {
      state = store.getState();
      if (state.sequencers[secondSegment.sequencerId].playingState !== secondSequencer.playingState) {
        secondSequencer = state.sequencers[secondSegment.sequencerId];
        sequencer = state.sequencers[segment.sequencerId];
        expect(secondSequencer.playingState).to.equal(PLAYING_STATES.PLAYING);
        expect(sequencer.playingState).to.equal(PLAYING_STATES.QUEUED);
        unsub();
        done();
      }
    });
  });
  
  it("level should now point to second segment", function () {
    level = state.levels.byId['level_4'];
    expect(level.segmentPlaybackIndex).to.equal(1);
  });

  it("auto first should start and second should be requeued", function (done) {
    sequencer = state.sequencers[segment.sequencerId];
    let unsub = store.subscribe(() => {
      state = store.getState();
      if (
        state.sequencers[segment.sequencerId].playingState !== sequencer.playingState
      ) {
        secondSequencer = state.sequencers[secondSegment.sequencerId];
        sequencer = state.sequencers[segment.sequencerId];
        if (sequencer.playingState === PLAYING_STATES.PLAYING) {
          expect(secondSequencer.playingState).to.equal(PLAYING_STATES.REQUEUED);
          unsub();
          done();
        }
      }
    });
  });
  
  it("should close down cleanly", function (done) {
    owaController.quit().then(() => {
      done();
    }).catch((err) => {
      done(err);
    });
  });

});
