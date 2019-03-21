import { expect } from 'chai';
import sinon from 'sinon';
import awakeningSequencers from 'awakening-sequencers'

import configureStore from '../src/configureStore';
import { SESSION_PHASES } from 'owa/constants';
import {
  buttonPressed,
  sessionPhaseAdvanced,
  owaSoundInitDone
} from '../src/actions';
import {
  getSegmentIdToSequencerId
} from '../src/selectors';
import IdleAnimation from '../src/IdleAnimation';

describe("IdleAnimation", function () {
  const store = configureStore();
  const state = store.getState();
  const segment = state.segments.byId[state.segments.allIds[0]];

  const idleAnimation = new IdleAnimation(store);
  idleAnimation.stop = sinon.fake();
  idleAnimation.startIdle = sinon.fake();
  idleAnimation.startQueueTrans6 = sinon.fake();
  idleAnimation.startTrans6 = sinon.fake();

  it('starts on startup', function () {
    store.dispatch(owaSoundInitDone());
    expect(idleAnimation.startIdle.callCount).to.equal(1);
  });
  it("should switch to queued animation when sequencer is queued", function () {
    idleAnimation.startQueueTrans6 = sinon.fake();
    store.dispatch(buttonPressed(segment.levelId, segment.segmentIndex));
    expect(idleAnimation.startQueueTrans6.callCount).to.equal(1);
  });
  it('should start trans6 when trans6 starts', function () {
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.TRANS_6));
    expect(idleAnimation.startTrans6.callCount).to.equal(1);
  });
  it("should switch to playing animation when sequencer is playing", function () {
    store.dispatch(sessionPhaseAdvanced(SESSION_PHASES.PLAYING_6));
    store.dispatch(awakeningSequencers.actions.sequencerPlaying(
        getSegmentIdToSequencerId(store.getState())[segment.segmentId]
    ));
    expect(idleAnimation.stop.callCount).to.equal(1);
  });
});
