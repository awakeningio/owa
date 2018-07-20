/**
 *  @file       sessionPhaseDurations.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { SESSION_PHASES } from '../constants';

const defaultState = {
  [SESSION_PHASES.QUEUE_TRANS_6]: 4,
  [SESSION_PHASES.TRANS_6]: 14 * 4,
  [SESSION_PHASES.QUEUE_TRANS_4]: 4,
  [SESSION_PHASES.TRANS_4]: 4 * 4,
  [SESSION_PHASES.QUEUE_TRANS_2]: 4,
  [SESSION_PHASES.TRANS_2]: 16,
  [SESSION_PHASES.QUEUE_TRANS_ADVICE]: 4,
  [SESSION_PHASES.TRANS_ADVICE]: 16
};

export default function sessionPhaseDurations (state = defaultState) {
  return state;
}
