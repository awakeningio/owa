/**
 *  @file       fadecandyConnection.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { CONNECTION_STATUS } from 'owa/constants';
import * as actionTypes from '../actionTypes';

export default function fadecandyConnection (state = CONNECTION_STATUS.DISCONNECTED, action) {
  switch (action.type) {
    case actionTypes.FADECANDY_CONNECTING:
      return CONNECTION_STATUS.CONNECTING;
    case actionTypes.FADECANDY_CONNECTED:
      return CONNECTION_STATUS.CONNECTED;
    case actionTypes.FADECANDY_DISCONNECTED:
      return CONNECTION_STATUS.DISCONNECTED;
    default:
      return state;
  }
}
