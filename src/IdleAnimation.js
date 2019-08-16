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

    this.state = {sessionPhase: null, songId: null};
    this.handle_state_change();

  }
  build() {}
  startIdle() {}
  startQueueTrans6() {}
  startTrans6() {}
  stop() {}
  handle_state_change () {
    const state = this.store.getState();
    const { songId } = this.params;

    // When sessionPhase changes, start or stop animation as 
    // appropriate.
    if (this.state.sessionPhase !== state.sessionPhase) {
      this.state = state;

      if (state.songId === songId) {
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
    // When song changes away from this animation's song, stops animation.
    if (this.state.songId !== state.songId) {
      state.songId = this.state.songId;

      if (state.songId !== songId) {
        this.stop();
      }
    }
  }

}

export default IdleAnimation;
