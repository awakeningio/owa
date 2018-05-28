/**
 *  @file       SegmentLightingController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/


import awakeningSequencers from 'awakening-sequencers';

import ControllerWithStore from './ControllerWithStore';
import SegmentQueuedAnimation from './SegmentQueuedAnimation';
import SegmentPlayingAnimation from './SegmentPlayingAnimation';

/**
 *  @class        SegmentLightingController
 *
 *  @classdesc    Responsible for coordinating the lighting of a single
 *  segment.
 **/
class SegmentLightingController extends ControllerWithStore {
  init () {
    let state = this.store.getState();
    let segment = state.segments.byId[this.params.segmentId];
    let sequencer = state.sequencers[segment.sequencerId];

    this.queuedAnimation = new SegmentQueuedAnimation({
      pixels: this.params.pixels
    });
    this.playingAnimation = new SegmentPlayingAnimation(this.store, {
      pixels: this.params.pixels,
      segmentId: this.params.segmentId
    });
    
    this.lastState = {
      sequencer
    };
  }

  tick () {
    //this.queuedAnimation.tick();
    if (this.lastState.sequencer.playingState === awakeningSequencers.PLAYING_STATES.PLAYING) {
      this.playingAnimation.tick();
    }
  }

  handle_state_change () {
    let state = this.store.getState();
    let segment = state.segments.byId[this.params.segmentId];
    let sequencer = state.sequencers[segment.sequencerId];

    if (sequencer.playingState !== this.lastState.sequencer.playingState) {
      this.lastState.sequencer = sequencer;

      // playing state changed, animation should change
      switch (sequencer.playingState) {
        case awakeningSequencers.PLAYING_STATES.QUEUED:
        case awakeningSequencers.PLAYING_STATES.REQUEUED:
          this.playingAnimation.stop();
          this.queuedAnimation.start();
          break;

        case awakeningSequencers.PLAYING_STATES.PLAYING:
          this.playingAnimation.start();
          this.queuedAnimation.stop();
          break;
        
        default:
          this.playingAnimation.stop();
          this.queuedAnimation.stop();
      }

    }
  }
}

export default SegmentLightingController;
