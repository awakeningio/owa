/**
 *  @file       AbletonLinkController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the MIT license.
 **/

import abletonlink from "abletonlink"
import abletonlinkRedux from "abletonlink-redux"

import ControllerWithStore from "./ControllerWithStore"

/**
 *  @class        AbletonLinkController
 *
 *  @classdesc    Entity which spawns the Ableton Link instance and
 *  translates updates into actions for the Redux state store.
 *  
 **/
class AbletonLinkController extends ControllerWithStore {
  init () {

    this.stateTreePrefix = this.params.stateTreePrefix;

    this.link = new abletonlink();

    var lastBpm = null;

    this.store.dispatch(abletonlinkRedux.actions.linkBPMChanged(
        this.link.bpm
    ));
    this.store.dispatch(abletonlinkRedux.actions.linkTransportChanged(
        this.link.beat,
        this.link.phase
    ));

    this.link.startUpdate(20, (beat, phase, bpm) => {
      if (bpm != lastBpm) {
        this.store.dispatch(abletonlinkRedux.actions.linkBPMChanged(bpm));
        lastBpm = bpm;
      }
      this.store.dispatch(abletonlinkRedux.actions.linkTransportChanged(beat, phase));
    });

  }

  handle_state_change() {
    var state = this.store.getState();

    if (this.stateTreePrefix) {
      state = state[this.stateTreePrefix];
    }

    if (state.queued_bpm) {
      this.link.bpm = state.queued_bpm;
    }
  }

  quit () {
    this.link.stopUpdate();
  }
}

export default AbletonLinkController;
