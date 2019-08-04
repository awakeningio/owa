/**
 *  @file       testSelectors.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { expect } from "chai";
import awakeningSequencers from "awakening-sequencers";

import configureStore from "../src/configureStore";
import { createInitialState } from "owa/state";
import {
  getLevel6Sequencers,
  getLevel4Sequencer,
  getLevel2Sequencers,
  getLevel6Segments,
  getLevel4Segments,
  getLevel2Segments,
  getLevel4Ready,
  getLevel2Ready,
  getRevealReady,
  getSegmentIdToSequencerId,
  getButtonSequencers
} from "../src/selectors";
import { buttonPressed, sessionPhaseAdvanced } from "../src/actions";
import { SESSION_PHASES } from "owa/constants";

const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

describe("getLevel6Segments", function() {
  var store, state;
  before(function() {
    store = configureStore();
    state = store.getState();
  });

  it("should select 6 segments", function() {
    var level6Segments = getLevel6Segments(state);

    expect(level6Segments).to.be.an("array");
    expect(level6Segments).to.have.lengthOf(6);
  });
});

describe("getLevel6Sequencers", function() {
  var store, state;
  before(function() {
    store = configureStore();
    state = store.getState();
  });

  it("should select a 6 sequencers", function() {
    var level6Sequencers;
    level6Sequencers = getLevel6Sequencers(state);

    expect(level6Sequencers).to.be.an("array");
    expect(level6Sequencers).to.have.lengthOf(6);
  });
});

describe("getLevel4Sequencer", function() {
  var store, state;

  before(function() {
    store = configureStore();
    state = store.getState();
  });

  it("should select a subset of state tree", function() {
    var level4Sequencer = getLevel4Sequencer(state);
    expect(level4Sequencer).to.be.an("object");
  });
});

describe("getLevel2Sequencer", function() {
  var store, state;

  before(function() {
    store = configureStore();
    state = store.getState();
  });

  it("should select 2 sequencers", function() {
    var level2Sequencers = getLevel2Sequencers(state);

    expect(level2Sequencers).to.be.an("array");
    expect(level2Sequencers.length).to.equal(2);
  });
});

describe("getLevel4Ready", function() {
  const store = configureStore();
  const level6Segments = getLevel6Segments(store.getState());

  it("should initially be false", function() {
    expect(getLevel4Ready(store.getState())).to.be.false;
  });

  it("should be false when level 6 transition is happening", function() {
    store.dispatch(
      buttonPressed(level6Segments[0].levelId, level6Segments[0].segmentIndex)
    );
    expect(getLevel4Ready(store.getState())).to.be.false;
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.TRANS_6));
    expect(getLevel4Ready(store.getState())).to.be.false;
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.PLAYING_6));
    store.dispatch(
      awakeningSequencers.actions.sequencerPlaying(
        getSegmentIdToSequencerId(store.getState())[level6Segments[0].segmentId]
      )
    );
    expect(getLevel4Ready(store.getState())).to.be.false;
  });

  it("should be true once all level 6 sequencers are playing", function() {
    let i;
    for (i = 1; i < level6Segments.length; i++) {
      store.dispatch(
        buttonPressed(level6Segments[i].levelId, level6Segments[i].segmentIndex)
      );
      store.dispatch(
        awakeningSequencers.actions.sequencerPlaying(
          getSegmentIdToSequencerId(store.getState())[
            level6Segments[i].segmentId
          ]
        )
      );
    }

    expect(getLevel4Ready(store.getState())).to.be.true;
  });

  it("should be false once a level 4 button has been pressed", function() {
    const level4Segment = getLevel4Segments(store.getState())[0];
    store.dispatch(
      buttonPressed(level4Segment.levelId, level4Segment.segmentIndex)
    );
    expect(getLevel4Ready(store.getState())).to.be.false;
  });
});

const setSequencerToPlaying = function(sequencer) {
  sequencer.playingState = PLAYING_STATES.PLAYING;
};

describe("getLevel2Ready", function() {
  it("should initially be false", function() {
    const store = configureStore();
    expect(getLevel2Ready(store.getState())).to.be.false;
  });

  it("should be true once all level4 sequencers have been touched", function() {
    const store = configureStore(createInitialState());
    let state = store.getState();
    const level6Segments = getLevel6Segments(state);
    const level4Segment = getLevel4Segments(state)[0];
    let i = 1;

    store.dispatch(
      buttonPressed(level6Segments[0].levelId, level6Segments[0].segmentIndex)
    );
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.TRANS_6));
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.PLAYING_6));
    state = store.getState();
    store.dispatch(
      awakeningSequencers.actions.sequencerPlaying(
        getSegmentIdToSequencerId(state)[level6Segments[0].segmentId]
      )
    );
    for (i = 1; i < level6Segments.length; i++) {
      store.dispatch(
        buttonPressed(level6Segments[i].levelId, level6Segments[i].segmentIndex)
      );
      state = store.getState();
      store.dispatch(
        awakeningSequencers.actions.sequencerPlaying(
          getSegmentIdToSequencerId(state)[level6Segments[i].segmentId]
        )
      );
    }
    state = store.getState();
    expect(getLevel4Ready(state)).to.be.true;

    store.dispatch(
      buttonPressed(level4Segment.levelId, level4Segment.segmentIndex)
    );
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.TRANS_4));
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.PLAYING_4));
    state = store.getState();
    store.dispatch(
      awakeningSequencers.actions.sequencerPlaying(
        getSegmentIdToSequencerId(state)[level4Segment.segmentId]
      )
    );

    expect(getLevel2Ready(store.getState())).to.be.false;
    state = store.getState();
    getLevel4Segments(state).forEach(function(segment) {
      store.dispatch(buttonPressed(segment.levelId, segment.segmentIndex));
    });

    state = store.getState();
    expect(getLevel2Ready(state)).to.be.true;
  });
});

describe("getButtonSequencers", function() {
  it("Should return a list of all 12 sequencers corresponding to each button", function() {
    const store = configureStore(createInitialState());
    const state = store.getState();
    const buttonSequencers = getButtonSequencers(state);

    expect(buttonSequencers).to.have.lengthOf(
      12,
      "buttonSequencers should have one sequencer for each button"
    );
  });
});

describe("getRevealReady", function() {
  it("should initially be false", function() {
    const store = configureStore();
    expect(getRevealReady(store.getState())).to.be.false;
  });

  it("should be true once all level 2 sequencers are playing", function() {
    const initialState = createInitialState();
    initialState.sessionPhase = SESSION_PHASES.PLAYING_2;
    getLevel6Sequencers(initialState).forEach(setSequencerToPlaying);
    getLevel4Sequencer(initialState).playingState = PLAYING_STATES.PLAYING;
    const level2Segments = getLevel2Segments(initialState);
    setSequencerToPlaying(
      initialState.sequencers[
        getSegmentIdToSequencerId(initialState)[level2Segments[0].segmentId]
      ]
    );
    const store = configureStore(initialState);
    expect(getRevealReady(store.getState())).to.be.false;

    store.dispatch(
      buttonPressed(level2Segments[1].levelId, level2Segments[1].segmentIndex)
    );
    store.dispatch(
      awakeningSequencers.actions.sequencerPlaying(
        getSegmentIdToSequencerId(store.getState())[level2Segments[1].segmentId]
      )
    );

    expect(getRevealReady(store.getState())).to.be.true;
  });
});
