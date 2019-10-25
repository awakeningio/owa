/**
 *  @file       inactivityTimeoutStartTime.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { BUTTON_PRESSED, SESSION_PHASE_ADVANCED } from "../actionTypes";
import { seconds_timestamp } from "../utils";

export default function inactivityTimeoutStartTime(state = -1, action) {
  switch (action.type) {
    case BUTTON_PRESSED:
    case SESSION_PHASE_ADVANCED:
      return seconds_timestamp();
    default:
      return state;
  }
}
