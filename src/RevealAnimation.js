import ControllerWithStore from "./ControllerWithStore";

import { SESSION_PHASES } from "owa/constants";

class RevealAnimation extends ControllerWithStore {
  init() {
    this.state = this.store.getState();
    this.build();
  }
  build() {}
  start() {}
  startAdvice() {}
  stop() {}
  handle_state_change() {
    const state = this.store.getState();
    const { songId } = this.params;

    if (
      this.state.sessionPhase !== state.sessionPhase &&
      state.songId === songId
    ) {
      switch (state.sessionPhase) {
        case SESSION_PHASES.PLAYING_2:
          this.build();
          break;
        case SESSION_PHASES.TRANS_ADVICE:
          this.start();
          break;
        case SESSION_PHASES.PLAYING_ADVICE:
          this.startAdvice();
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

export default RevealAnimation;
