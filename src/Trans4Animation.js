/**
 *  @file       Trans4Animation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2019 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import ControllerWithStore from './ControllerWithStore';
import { SESSION_PHASES } from 'owa/constants';

class Trans4Animation extends ControllerWithStore {
  init() {
    this.state = this.store.getState();
    this.build();
  }
  handle_state_change () {
    const state = this.store.getState();

    if (this.state.sessionPhase !== state.sessionPhase) {
      this.state = state;
      switch (state.sessionPhase) {
        case SESSION_PHASES.TRANS_4:
          this.build();
          this.start();
          break;

        default:
          this.stop();
          break;
      }
    }

  }
}

export default Trans4Animation;
