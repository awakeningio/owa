/**
 *  @file       SegmentLightingController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import awakeningSequencers from "awakening-sequencers";

import ControllerWithStore from "./ControllerWithStore";
import SegmentQueuedAnimation from "./SegmentQueuedAnimation";
import SegmentPlayingAnimation from "./SegmentPlayingAnimation";
import SegmentNoopAnimation from "./SegmentNoopAnimation";
import { SESSION_PHASES } from "owa/constants";
import {
  getSegmentIdToBufName,
  getLevel4Sequencer,
  getSegmentIdToSequencerId
} from "./selectors";

const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

/**
 *  @class        SegmentLightingController
 *
 *  @classdesc    Responsible for coordinating the lighting of a single
 *  segment.
 **/
class SegmentLightingController extends ControllerWithStore {
  init() {
    const { pixels, segmentId, pyramidPixels } = this.params;
    const state = this.store.getState();
    const segment = state.segments.byId[segmentId];
    const sequencer =
      state.sequencers[getSegmentIdToSequencerId(state)[segmentId]];

    this.queuedAnimation = new SegmentQueuedAnimation({
      pixels
    });
    this.playingAnimation = new SegmentPlayingAnimation(this.store, {
      pixels,
      segmentId,
      pyramidPixels
    });
    this.noopAnimation = new SegmentNoopAnimation({
      pixels
    });

    this.lastState = {
      sequencer,
      segment
    };
  }

  //tick () {
  //const segmentIdToBufName = getSegmentIdToBufName(this.lastState);
  //let sequencer = this.lastState.sequencer;
  //let segment = this.lastState.segment;

  //if (sequencer.sequencerId === 'level_4') {
  //if (
  //sequencer.playingState === awakeningSequencers.PLAYING_STATES.PLAYING
  //&& sequencer.event.bufName === segmentIdToBufName[segment.segmentId]
  //) {
  //this.playingAnimation.tick();
  //}
  //} else {
  //if (sequencer.playingState === awakeningSequencers.PLAYING_STATES.PLAYING) {
  //this.playingAnimation.tick();
  //}
  //}

  //}

  handle_state_change() {
    const state = this.store.getState();
    const segmentIdToBufName = getSegmentIdToBufName(state);
    const level4Sequencer = getLevel4Sequencer(state);
    const segment = state.segments.byId[this.params.segmentId];
    const sequencer =
      state.sequencers[getSegmentIdToSequencerId(state)[this.params.segmentId]];
    const sessionPhase = state.sessionPhase;

    if (segment !== this.lastState.segment) {
      if (
        segment.lastButtonPressTime !==
          this.lastState.segment.lastButtonPressTime &&
        sequencer.playingState === PLAYING_STATES.STOPPED &&
        [SESSION_PHASES.PLAYING_6, SESSION_PHASES.PLAYING_4].includes(
          sessionPhase
        )
      ) {
        // segment button was pressed and sequencer is still stopped,
        // means this was a no-op
        this.noopAnimation.start();
      }

      this.lastState.segment = segment;
    }

    if (sequencer === level4Sequencer) {
      if (
        sequencer.playingState !== this.lastState.sequencer.playingState ||
        sequencer.event.bufName !== this.lastState.sequencer.event.bufName ||
        sequencer.bufSequence !== this.lastState.sequencer.bufSequence
      ) {
        this.lastState.sequencer = sequencer;

        if (sequencer.playingState === PLAYING_STATES.PLAYING) {
          const ourBufNameIndex = sequencer.bufSequence.indexOf(
            segmentIdToBufName[segment.segmentId]
          );
          const currentBufNameIndex = sequencer.bufSequence.indexOf(
            sequencer.event.bufName
          );

          // if our portion of the chord prog is playing
          if (
            sequencer.event.bufName === segmentIdToBufName[segment.segmentId]
          ) {
            this.playingAnimation.start();
            this.queuedAnimation.stop();
          } else if (
            // our portion of the chord prog is next
            ourBufNameIndex > -1 &&
            ourBufNameIndex ===
              (currentBufNameIndex + 1) % sequencer.bufSequence.length
          ) {
            this.playingAnimation.stop();
            this.queuedAnimation.start();
          } else {
            this.playingAnimation.stop();
            this.queuedAnimation.stop();
          }
        } else if (sequencer.playingState === PLAYING_STATES.STOP_QUEUED) {
          // Does nothing when stop is queued (let animations continue)
          return;
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
            switch (state.sessionPhase) {
              case SESSION_PHASES.PLAYING_6:
              case SESSION_PHASES.PLAYING_4:
              case SESSION_PHASES.PLAYING_2:
                this.queuedAnimation.start();
                break;

              default:
                this.queuedAnimation.stop();
                break;
            }
            break;

          case awakeningSequencers.PLAYING_STATES.PLAYING:
            this.playingAnimation.start();
            this.queuedAnimation.stop();
            break;

          case awakeningSequencers.PLAYING_STATES.STOP_QUEUED:
            // Do nothing when stop is queued, let the animations continue
            break;

          default:
            this.playingAnimation.stop();
            this.queuedAnimation.stop();
            break;
        }
      }
    }
  }
}

export default SegmentLightingController;
