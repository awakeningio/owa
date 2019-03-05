import { expect } from 'chai';
import sinon from 'sinon';

import awakeningSequencers from 'awakening-sequencers';
import configureStore from "../src/configureStore"
import { SESSION_PHASES } from 'owa/constants';
import LightingController from '../src/LightingController.js'
import {
  buttonPressed,
  sessionPhaseAdvanced
} from '../src/actions';
import { getLevel6Segments, getLevel4Segments } from '../src/selectors';

describe("LevelReadyAnimation", function () {
  const store = configureStore();
  const state = store.getState();
  const lightingController = new LightingController(store);
  const level4ReadyAnimation = lightingController.level4ReadyAnimation;

  level4ReadyAnimation.start = sinon.fake();
  level4ReadyAnimation.stop = sinon.fake();

  it('should be stopped while level 6 is playing', function () {
    const segment = state.segments.byId[state.segments.allIds[0]];

    store.dispatch(buttonPressed(segment.levelId, segment.segmentIndex));
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.PLAYING_6));
    store.dispatch(awakeningSequencers.actions.sequencerPlaying(
        segment.sequencerId
    ));

    expect(level4ReadyAnimation.start.callCount).to.equal(0);
  });

  it('should start when all level 6 sequencers are playing', function () {
    getLevel6Segments(state).forEach(function (segment) {
      store.dispatch(awakeningSequencers.actions.sequencerPlaying(
          segment.sequencerId
      ));
    });

    expect(level4ReadyAnimation.start.callCount).to.equal(1);
  });

  it('should stop when transitioned to level 4', function () {
    const level4Segment = getLevel4Segments(state)[0];
    store.dispatch(
      buttonPressed(level4Segment.levelId, level4Segment.segmentIndex)
    );
    expect(level4ReadyAnimation.stop.callCount).to.equal(1);
  });
});
