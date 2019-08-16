/**
 *  @file       Trans2Animation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2019 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { SESSION_PHASES } from "owa/constants";
import ControllerWithStore from "./ControllerWithStore";

class Trans2Animation extends ControllerWithStore {
  init() {
    this.state = this.store.getState();
    this.build();
  }
  handle_state_change() {
    const state = this.store.getState();
    const { songId } = this.params;

    if (
      this.state.sessionPhase !== state.sessionPhase &&
      state.songId === songId
    ) {
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

    if (state.songId !== this.state.songId && state.songId !== songId) {
      this.stop();
    }
    this.state = state;
  }
}

export default Trans2Animation;
