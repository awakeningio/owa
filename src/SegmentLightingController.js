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
import SegmentActiveAnimation from './SegmentActiveAnimation';
import { SESSION_PHASES } from "owa/constants";
import { setPixelsOff } from './Pixels';
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
    const { pixels, segmentId, pyramidPixels, tweenGroup } = this.params;
    const state = this.store.getState();
    const segment = state.segments.byId[segmentId];
    const sequencer =
      state.sequencers[getSegmentIdToSequencerId(state)[segmentId]];
    this.queuedAnimation = new SegmentQueuedAnimation({
      pixels,
      tweenGroup
    });
    this.activeAnimation = new SegmentActiveAnimation({
      pixels,
      tweenGroup
    });
    this.playingAnimation = new SegmentPlayingAnimation(this.store, {
      pixels,
      segmentId,
      pyramidPixels,
      tweenGroup
    });
    this.noopAnimation = new SegmentNoopAnimation({
      pixels,
      tweenGroup
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
  //
  turnPixelsOff () {
    const { pixels } = this.params;
    setPixelsOff(pixels);
  }

  handle_state_change() {
    const state = this.store.getState();
    const segmentIdToBufName = getSegmentIdToBufName(state);
    const level4Sequencer = getLevel4Sequencer(state);
    const segment = state.segments.byId[this.params.segmentId];
    const sequencer =
      state.sequencers[getSegmentIdToSequencerId(state)[this.params.segmentId]];

    if (segment !== this.lastState.segment) {
      if (
        segment.lastButtonPressTime !==
          this.lastState.segment.lastButtonPressTime &&
        sequencer.playingState === PLAYING_STATES.STOPPED &&
        sequencer.queueOnPhaseStart === false
      ) {
        // segment button was pressed and sequencer is still stopped,
        // means this was a no-op
        this.noopAnimation.start();
      }

      this.lastState.segment = segment;
    }

    // Watches the sessionPhase, when the SegmentLightingController 
    // takes back "control" once a sessionPhase transitions, clear the pixels
    // for this segment (a "re-paint")
    const sessionPhase = state.sessionPhase;
    if (sessionPhase !== this.lastState.sessionPhase) {
      this.lastState.sessionPhase = sessionPhase;

      switch (sessionPhase) {
        case SESSION_PHASES.PLAYING_6:
        case SESSION_PHASES.PLAYING_4:
        case SESSION_PHASES.PLAYING_2:
          this.turnPixelsOff();
          break;
        default:
          break;
      }
    }

    if (sequencer === level4Sequencer) {
      if (
        sequencer.playingState !== this.lastState.sequencer.playingState ||
        sequencer.queueOnPhaseStart !==
          this.lastState.sequencer.queueOnPhaseStart ||
        sequencer.event.bufName !== this.lastState.sequencer.event.bufName ||
        sequencer.bufSequence !== this.lastState.sequencer.bufSequence
      ) {

        if (
          // If the first level4 segment was queued
          sequencer.queueOnPhaseStart !== false &&
          // And it was ours
          sequencer.bufSequence[0] === segmentIdToBufName[segment.segmentId]
        ) {
          // Start queued animation for this segment
          this.queuedAnimation.start();
        } else if (sequencer.playingState === PLAYING_STATES.PLAYING) {
          // TODO: This is called too frequently, it should track when
          // `bufName` changes to determine playback changes or `playingState`
          // changes to determine entire level 4 start / stop
          // Determines which chord in progression is playing and plays
          // the playingAnimation or queuedAnimation appropriately.  If not
          // next or currently playing, segment should be cleared.
          const ourBufNameIndex = sequencer.bufSequence.indexOf(
            segmentIdToBufName[segment.segmentId]
          );
          const currentBufNameIndex = sequencer.bufSequence.indexOf(
            sequencer.event.bufName
          );
          // Determines if this segment is the one playing
          if (
            sequencer.event.bufName === segmentIdToBufName[segment.segmentId]
          ) {
            this.playingAnimation.start();
            this.queuedAnimation.stop();
            this.activeAnimation.stop();
          } else if (
            // Determines if this segment is next
            ourBufNameIndex > -1 &&
            ourBufNameIndex ===
              (currentBufNameIndex + 1) % sequencer.bufSequence.length
          ) {
            this.playingAnimation.stop();
            this.queuedAnimation.start();
            this.activeAnimation.stop();
          } else if (
            // Determines if this segment has been activated but is not next
            ourBufNameIndex > -1
          ) {
            this.playingAnimation.stop();
            this.queuedAnimation.stop();
            this.activeAnimation.start();
            
          } else {
            // Determines, by default, that this segment is not playing or
            // next.
            this.playingAnimation.stop();
            this.queuedAnimation.stop();
            this.activeAnimation.stop();
            this.turnPixelsOff();
          }
        } else if (sequencer.playingState === PLAYING_STATES.STOP_QUEUED) {
          // Does nothing when stop is queued (let animations continue)
          return;
        } else {
          this.playingAnimation.stop();
          this.queuedAnimation.stop();
          this.activeAnimation.stop();
        }
        this.lastState.sequencer = sequencer;
      }
    } else {
      // Handles when playingState changed or queueOnPhaseStart changed
      if (
        sequencer.playingState !== this.lastState.sequencer.playingState ||
        sequencer.queueOnPhaseStart !==
          this.lastState.sequencer.queueOnPhaseStart
      ) {
        this.lastState.sequencer = sequencer;

        if (sequencer.queueOnPhaseStart !== false) {
          this.playingAnimation.stop();
          this.queuedAnimation.start();
        } else if (
          sequencer.playingState == awakeningSequencers.PLAYING_STATES.QUEUED ||
          sequencer.playingState === awakeningSequencers.PLAYING_STATES.REQUEUED
        ) {
          this.playingAnimation.stop();
          switch (state.sessionPhase) {
            case SESSION_PHASES.PLAYING_6:
            case SESSION_PHASES.PLAYING_4:
            case SESSION_PHASES.PLAYING_2:
              this.queuedAnimation.start();
              break;

            default:
              // this was queued during a transition
              this.queuedAnimation.stop();
              break;
          }
        } else if (
          sequencer.playingState === awakeningSequencers.PLAYING_STATES.PLAYING
        ) {
          this.playingAnimation.start();
          this.queuedAnimation.stop();
        } else if (
          sequencer.playingState ===
          awakeningSequencers.PLAYING_STATES.STOP_QUEUED
        ) {
          // if stop was queued, animation continues to play because sequencer
          // continues to play.
          return;
        } else {
          this.playingAnimation.stop();
          this.queuedAnimation.stop();
        }
      }
    }
  }
}

export default SegmentLightingController;
