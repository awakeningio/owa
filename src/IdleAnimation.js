/**
 *  @file       IdleAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2019 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/
import ControllerWithStore from './ControllerWithStore';
import { SESSION_PHASES } from 'owa/constants';

class IdleAnimation extends ControllerWithStore {
  init() {

    this.state = {sessionPhase: null};
    this.build();

  }
  build() {}
  startIdle() {}
  startQueueTrans6() {}
  startTrans6() {}
  stop() {}
  handle_state_change () {
    const state = this.store.getState();

    if (this.state.sessionPhase !== state.sessionPhase) {
      this.state = state;
      switch (state.sessionPhase) {
        case SESSION_PHASES.IDLE:
          this.build();
          this.startIdle();
          break;

        case SESSION_PHASES.TRANS_6:
          this.startTrans6();
          break;

        case SESSION_PHASES.QUEUE_TRANS_6:
          this.startQueueTrans6();
          break;
        
        default:
          this.stop();
          break;
      }
    }
  }
}

export default IdleAnimation;