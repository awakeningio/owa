/**
 *  @file       Trans2Animation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2019 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { SESSION_PHASES } from 'owa/constants';
import ControllerWithStore from './ControllerWithStore';

class Trans2Animation extends ControllerWithStore {
  init() {
    this.state = this.store.getState();
    this.build();
  }
  handle_state_change () {
    const state = this.store.getState();

    if (this.state.sessionPhase !== state.sessionPhase) {
      this.state = state;

      switch (state.sessionPhase) {
        case SESSION_PHASES.TRANS_2:
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

export default Trans2Animation;
