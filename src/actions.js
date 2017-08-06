/**
 *  @file       actions.js
 *
 *	@desc       Methods containing templates to use for creating actions in js.
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
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
