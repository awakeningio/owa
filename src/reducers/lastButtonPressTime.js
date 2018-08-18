/**
 *  @file       lastButtonPressTime.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { BUTTON_PRESSED } from '../actionTypes';

/**
 *  For tracking inactivity, -1 means a button was never pressed.
 **/
export default function lastButtonPressTime (state = -1, action) {
  switch (action.type) {
    case BUTTON_PRESSED:
      return (new Date()).getTime();
    
    default:
      return state;
  }
}
