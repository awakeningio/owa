/**
 *  @file       InactivityTimeoutController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import ControllerWithStore from "./ControllerWithStore";

import { SESSION_PHASES, VARIATION_INTERACTION_STATES } from "owa/constants";
import {
  inactivityTimeoutExceeded,
  variationMenuTimeoutExceeded
} from "./actions";
import { getButtonSequencers } from "./selectors";
import { seconds_timestamp } from "./utils";

const CHECK_INTERVAL_MS = 5000;
const INACTIVE_THRESHOLD_SECS = 120;
//const INACTIVE_THRESHOLD_SECS = 10000;

const MENU_CHECK_INTERVAL_MS = 250;
const MENU_INACTIVE_THRESHOLD_SECS = 2;

class InactivityTimeoutController extends ControllerWithStore {
  init() {
    // Uses an interval to check for total system inactivity
    this.interval = setInterval(
      () => this.checkSystemInactivity(),
      CHECK_INTERVAL_MS
    );

    // Uses a shorter interval to check for button menu inactivity
    this.menuCheckInterval = setInterval(
      () => this.checkMenuInactivity(),
      MENU_CHECK_INTERVAL_MS
    );
  }

  checkSystemInactivity() {
    const state = this.store.getState();

    const now = seconds_timestamp();
    const timeSinceInactivityTimeoutStart =
      now - state.inactivityTimeoutStartTime;

    switch (state.sessionPhase) {
      case SESSION_PHASES.PLAYING_6:
      case SESSION_PHASES.PLAYING_4:
      case SESSION_PHASES.PLAYING_2:
        if (timeSinceInactivityTimeoutStart > INACTIVE_THRESHOLD_SECS) {
          this.store.dispatch(inactivityTimeoutExceeded());
        }
        break;

      default:
        break;
    }
  }

  checkMenuInactivity() {
    const state = this.store.getState();

    const now = seconds_timestamp();

    // For all button sequencers, determines if menu should be closed and
    // variation parameters applied
    const buttonSequencers = getButtonSequencers(state);

    buttonSequencers.forEach(seq => {
      const menuState = seq.variationInteractionState;
      const timeSinceLastPress = now - seq.lastButtonPressTime;
      if (
        menuState === VARIATION_INTERACTION_STATES.CHOOSING &&
        timeSinceLastPress >= MENU_INACTIVE_THRESHOLD_SECS
      ) {
        this.store.dispatch(variationMenuTimeoutExceeded(seq.sequencerId));
      }
    });
  }

  quit() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    if (this.menuCheckInterval) {
      clearInterval(this.menuCheckInterval);
    }
  }
}

export default InactivityTimeoutController;
