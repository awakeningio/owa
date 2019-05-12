/**
 *  @file       testSequencer.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import OWAController from '../OWAController';
import configureStore from '../configureStore'
import { buttonPressed } from '../actions'
import { SESSION_PHASES } from 'owa/constants';

var owaStateStore = configureStore({
  sessionPhaseDurations: {
    [SESSION_PHASES.QUEUE_TRANS_6]: 4,
    [SESSION_PHASES.TRANS_6]: 4 * 4,
    [SESSION_PHASES.QUEUE_TRANS_4]: 4,
    [SESSION_PHASES.TRANS_4]: 4 * 4,
    [SESSION_PHASES.QUEUE_TRANS_2]: 4,
    [SESSION_PHASES.TRANS_2]: 4 * 4,
    [SESSION_PHASES.PLAYING_2]: 8,
    [SESSION_PHASES.QUEUE_TRANS_ADVICE]: 4,
    [SESSION_PHASES.TRANS_ADVICE]: 6 * 4,
    [SESSION_PHASES.PLAYING_ADVICE]: 55 * 4
  }
});
//
const main = function () {
  owaStateStore.dispatch(buttonPressed('level_6', 0));
  setTimeout(function () {
    //store.dispatch(awakeningSequencers.actions.sequencerQueued('2_0'));
    //store.dispatch(awakeningSequencers.actions.sequencerQueued('2_1'));
    //store.dispatch(awakeningSequencers.actions.sequencerQueued('6_5'));
    //store.dispatch(awakeningSequencers.actions.sequencerQueued('6_0'));
    //store.dispatch(awakeningSequencers.actions.sequencerQueued('6_1'));
    //store.dispatch(awakeningSequencers.actions.sequencerQueued('6_2'));
    //store.dispatch(awakeningSequencers.actions.sequencerQueued('6_3'));
    //store.dispatch(awakeningSequencers.actions.sequencerQueued('6_4'));

    setTimeout(() => owaStateStore.dispatch(buttonPressed('level_6', 1)), 2000);
    setTimeout(() => owaStateStore.dispatch(buttonPressed('level_6', 2)), 2000);
    setTimeout(() => owaStateStore.dispatch(buttonPressed('level_6', 3)), 2000);
    setTimeout(() => owaStateStore.dispatch(buttonPressed('level_6', 4)), 2000);

    //setTimeout(function () {
      //store.dispatch(buttonPressed('level_4', 0));
      ////store.dispatch(awakeningSequencers.actions.sequencerStopQueued('6_5'));
      ////setTimeout(function () {
        ////store.dispatch(awakeningSequencers.actions.sequencerQueued('6_5'));
      ////}, 750);
    //}, 5000);
    ////store.dispatch(awakeningSequencers.actions.sequencerQueued('trans'));
  }, 15000);
};

new OWAController(owaStateStore, {
  onInit: main
});
