/**
 *  @file       InactivityTimeoutController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import ControllerWithStore from './ControllerWithStore';

import { SESSION_PHASES } from 'owa/constants';
import { inactivityTimeoutExceeded } from './actions';

const CHECK_INTERVAL_MS = 5000;
const INACTIVE_THRESHOLD_MS = 120000;
//const INACTIVE_THRESHOLD_MS = 10000;

const MENU_CHECK_INTERVAL_MS = 1000;

class InactivityTimeoutController extends ControllerWithStore {
  init () {

    // Uses an interval to check for total system inactivity
    this.interval = setInterval(() => {
      this.checkSystemInactivity();
    }, CHECK_INTERVAL_MS);

    // Uses a shorter interval to check for button menu inactivity
    this.menuCheckInterval = setInterval(() => {
      this.checkMenuInactivity();
    }, MENU_CHECK_INTERVAL_MS);
  }

  checkSystemInactivity () {
    const state = this.store.getState();

    const now = (new Date()).getTime();
    const timeSinceInactivityTimeoutStart = now - state.inactivityTimeoutStartTime;

    switch (state.sessionPhase) {
      case SESSION_PHASES.PLAYING_6:
      case SESSION_PHASES.PLAYING_4:
      case SESSION_PHASES.PLAYING_2:
        if (timeSinceInactivityTimeoutStart > INACTIVE_THRESHOLD_MS) {
          this.store.dispatch(inactivityTimeoutExceeded());
        }
        break;
      
      default:
        break;
    }

  }

  checkMenuInactivity () {
    const state = this.store.getState();

    const now = (new Date()).getTime();

    // For all button sequencers, checks if they have an open menu, if the
    // timeout duration has elapsed, and the changes have not yet been applied
    // TODO

  }

  quit () {
    if (this.interval) {
      clearInterval(this.interval);
    }

    if (this.menuCheckInterval) {
      clearInterval(this.menuCheckInterval);
    }
  }
}

export default InactivityTimeoutController;
