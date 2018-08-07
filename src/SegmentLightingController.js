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
import { SESSION_PHASES } from './constants';

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
      sequencer,
      segment
    };
  }

  tick () {
    let sequencer = this.lastState.sequencer;
    let segment = this.lastState.segment;

    if (sequencer.sequencerId === 'level_4') {
      if (
        sequencer.playingState === awakeningSequencers.PLAYING_STATES.PLAYING
        && sequencer.event.bufName === segment.sequencerProps.bufName
      ) {
        this.playingAnimation.tick();
      }
    } else {
      if (sequencer.playingState === awakeningSequencers.PLAYING_STATES.PLAYING) {
        this.playingAnimation.tick();
      }
    }

  }

  handle_state_change () {
    let state = this.store.getState();
    let segment = state.segments.byId[this.params.segmentId];
    let sequencer = state.sequencers[segment.sequencerId];
    let sessionPhase = state.sessionPhase;

    if (sequencer.sequencerId === 'level_4') {
      if (
        sequencer.playingState !== this.lastState.sequencer.playingState
        || sequencer.event.bufName !== this.lastState.sequencer.event.bufName
        || sequencer.bufSequence !== this.lastState.sequencer.bufSequence
      ) {
        this.lastState.sequencer = sequencer;
        let ourSequencerProps;
        switch (sessionPhase) {
          case SESSION_PHASES.QUEUE_TRANS_4:
          case SESSION_PHASES.TRANS_4:
          case SESSION_PHASES.PLAYING_4:
            ourSequencerProps = segment.sequencerProps;
            break;

          case SESSION_PHASES.QUEUE_TRANS_2:
          case SESSION_PHASES.TRANS_2:
          case SESSION_PHASES.PLAYING_2:
            ourSequencerProps = segment.level2SequencerProps;
            break;
          
          default:
            ourSequencerProps = {bufName: null};
            break;
        }
        let ourBufNameIndex = sequencer.bufSequence.indexOf(
          ourSequencerProps.bufName
        );
        let currentBufNameIndex = sequencer.bufSequence.indexOf(
          sequencer.event.bufName
        );

        // TODO: playback animations don't work on l2

        // if our portion of the chord prog is playing
        if (sequencer.event.bufName === ourSequencerProps.bufName) {
          this.playingAnimation.start();
          this.queuedAnimation.stop();
        } else if (
          // our portion of the chord prog is next
          ourBufNameIndex > -1
          && ourBufNameIndex === (
            (currentBufNameIndex + 1) % sequencer.bufSequence.length
          )
        ) {
          this.playingAnimation.stop();
          this.queuedAnimation.start();
        } else {
          this.playingAnimation.stop();
          this.queuedAnimation.stop();
        }
      }
    } else {
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
}

export default SegmentLightingController;
