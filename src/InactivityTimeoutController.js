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

class InactivityTimeoutController extends ControllerWithStore {
  init () {
    setInterval(() => {
      this.checkInactivityTimeout();
    }, CHECK_INTERVAL_MS);
  }

  checkInactivityTimeout () {
    let state = this.store.getState();

    let now = (new Date()).getTime();
    let timeSinceInactivityTimeoutStart = now - state.inactivityTimeoutStartTime;

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
}

export default InactivityTimeoutController;
