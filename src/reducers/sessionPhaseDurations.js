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
  [SESSION_PHASES.TRANS_6]: 15 * 4,
  [SESSION_PHASES.QUEUE_TRANS_4]: 4,
  [SESSION_PHASES.TRANS_4]: 3 * 4,
  [SESSION_PHASES.QUEUE_TRANS_2]: 4,
  [SESSION_PHASES.TRANS_2]: 4 * 4,
  [SESSION_PHASES.PLAYING_2]: 8,
  [SESSION_PHASES.QUEUE_TRANS_ADVICE]: 4,
  [SESSION_PHASES.TRANS_ADVICE]: 6 * 4,
  [SESSION_PHASES.PLAYING_ADVICE]: 55 * 4
};

export default function sessionPhaseDurations (state = defaultState) {
  return state;
}
