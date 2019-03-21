import { expect } from 'chai';

import awakeningSequencers from 'awakening-sequencers';
import { OWA_READY_STATES, SESSION_PHASES } from 'owa/constants'
import configureStore from "../src/configureStore"
import OWAController from "../src/OWAController"
import { create_segmentId } from 'owa/models'
import { createInitialState } from 'owa/state';
import {
  getSegmentIdToBufName,
  getLevel6Sequencers,
  getSegmentIdToSequencerId
} from '../src/selectors';
import * as actions from '../src/actions'

const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

describe("Sequential Sequencer", function () {
  var store,
    state,
    segment,
    sequencer,
    level,
    secondSegment,
    segmentIdToBufName,
    owaController;

  it("should init properly", function (done) {
    var unsub, soundReady;
    const initialState = createInitialState()
    
    initialState.sessionPhaseDurations[SESSION_PHASES.QUEUE_TRANS_4] = 2;
    initialState.sessionPhaseDurations[SESSION_PHASES.TRANS_4] = 2;
    initialState.sessionPhase = SESSION_PHASES.PLAYING_6;
    getLevel6Sequencers(initialState).forEach(function (seq) {
      seq.playingState = PLAYING_STATES.PLAYING;
    });
    
    store = configureStore(initialState);
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
      disableInactivity: true
    });
  });
  
  // start testing level 4
  it("should immediately start transition when level4 button is pressed", function () {
    level = state.levels.byId['level_4'];
    store.dispatch(actions.buttonPressed(level.levelId, 0));
    state = store.getState();
    segmentIdToBufName = getSegmentIdToBufName(state);
    segment = state.segments.byId[create_segmentId(level.levelId, 0)];
    sequencer = state.sequencers[
      getSegmentIdToSequencerId(state)[segment.segmentId]
    ];
    expect(state.sessionPhase).to.equal(SESSION_PHASES.QUEUE_TRANS_4);
  });
  
  it("sequencer should have updated playback order on button press", function () {
    level = state.levels.byId['level_4'];
    segment = state.segments.byId[create_segmentId(level.levelId, 0)];
    sequencer = state.sequencers[
      getSegmentIdToSequencerId(state)[segment.segmentId]
    ];
    expect(sequencer).to.have.property('bufSequence');
    expect(sequencer.bufSequence).to.be.a('array');
    expect(sequencer.bufSequence).to.have.lengthOf(1);
    expect(sequencer.bufSequence[0]).to.equal(
      segmentIdToBufName[segment.segmentId]
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
    segmentIdToBufName = getSegmentIdToBufName(state);
    level = state.levels.byId['level_4'];
    sequencer = state.sequencers[
      getSegmentIdToSequencerId(state)[segment.segmentId]
    ];
    expect(state.sessionPhase).to.equal(SESSION_PHASES.PLAYING_4);
  });

  it("should have updated playback order because button press", function () {
    expect(sequencer.bufSequence).to.have.lengthOf(2);
    expect(sequencer.bufSequence[0]).to.equal(
      segmentIdToBufName[secondSegment.segmentId]
    );
    expect(sequencer.bufSequence[1]).to.equal(
      segmentIdToBufName[segment.segmentId]
    );
  });

  it("should close down cleanly", function (done) {
    this.owaController.quit().then(() => done()).catch(done);
  });
});
