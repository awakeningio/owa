/**
 *  @file       actions.js
 *
 *	@desc       Methods containing templates to use for creating actions in js.
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import * as actionTypes from './actionTypes';

export function sessionPhaseAdvanced (phase) {
  return {
    type: actionTypes.SESSION_PHASE_ADVANCED,
    payload: {
      phase
    }
  }
}

export function buttonPressed (levelId, segmentIndex) {
  return {
    type: actionTypes.BUTTON_PRESSED,
    payload: {
      levelId,
      segmentIndex
    }
  };
}
