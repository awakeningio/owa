/**
 *  @file       inactivityTimeoutStartTime.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { BUTTON_PRESSED, SESSION_PHASE_ADVANCED } from '../actionTypes';

export default function inactivityTimeoutStartTime (state = -1, action) {
  switch (action.type) {
    case BUTTON_PRESSED:
    case SESSION_PHASE_ADVANCED:
      return (new Date()).getTime();
    default:
      return state;
  }
}
