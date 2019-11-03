/**
 *  @file       SegmentPlayingAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import Color from "color";
import TWEEN from "@tweenjs/tween.js";

import SCReduxSequencers from "supercollider-redux-sequencers";
import ControllerWithStore from "./ControllerWithStore";
import { setPixelColors, setPixelsColors } from "./Pixels";
import { getSegmentIdToSequencerId } from "./selectors";
import { SEGMENTID_TO_PYRAMID_INDEX } from 'owa/constants';
import { isRest } from './utils';

const dimLayerColor = Color.hsv([0.72 * 360, 20, 20]);
const playingLayerColor = Color.hsv([0.72 * 360, 50, 50]);
//const playingBeatColor = Color.hsv([0.72 * 360, 50, 100]);

class SegmentPlayingAnimation extends ControllerWithStore {
  init() {
    const { segmentId, pyramidPixels } = this.params;
    const state = this.store.getState();
    const sequencer =
      state.sequencers[getSegmentIdToSequencerId(state)[segmentId]];

    const pyramidIndex = SEGMENTID_TO_PYRAMID_INDEX[segmentId];
    this.segmentPyramidPixels = pyramidPixels[pyramidIndex];

    this.phaseTween = null;
    this.beatPulseTween = null;

    this.animationState = {
      phase: 0.0,
      pulseBrightness: 1.0
    };

    this.lastState = {
      sequencer
    };
    this.build();
  }
  build() {}
  start() {
    const { tweenGroup } = this.params;
    const state = this.store.getState();
    const tempo = state.tempo;
    const sequencer =
      state.sequencers[getSegmentIdToSequencerId(state)[this.params.segmentId]];
    const duration = (sequencer.numBeats / tempo) * 60000.0;
    const pixels = this.params.pixels;

    this.stop();

    this.animationState = {
      pulseBrightness: 0.0
    };

    let i, progressPixel;
    this.phaseTween = new TWEEN.Tween({ phase: 0.0 }, tweenGroup)
      .to({ phase: 1.0 }, duration)
      .onUpdate(props => {
        progressPixel = Math.round(props.phase * pixels.length);
        // display progress phase
        for (i = 0; i < progressPixel; i++) {
          setPixelColors(
            pixels,
            i,
            playingLayerColor.value(
              50 + 50 * this.animationState.pulseBrightness
            )
          );
        }
        // fill remaining LEDs to same dim color
        for (i = progressPixel; i < pixels.length; i++) {
          setPixelColors(
            pixels,
            i,
            dimLayerColor.value(20 + 80 * this.animationState.pulseBrightness)
          );
        }

        // Also pulse corresponding pyramid
        setPixelsColors(
          this.segmentPyramidPixels,
          dimLayerColor.value(20 + 80 * this.animationState.pulseBrightness)
        );

      })
      .repeat(Infinity)
      .start();
  }
  stop() {
    if (this.phaseTween) {
      this.phaseTween.stop();
    }
    if (this.beatPulseTween) {
      this.beatPulseTween.stop();
    }
    this.build();
  }
  handle_state_change() {
    const state = this.store.getState();
    const { tweenGroup } = this.params;
    const sequencer =
      state.sequencers[getSegmentIdToSequencerId(state)[this.params.segmentId]];

    //if (sequencer.playingState !== this.lastState.sequencer.playingState) {

    //switch (sequencer.playingState) {
    //case SCReduxSequencers.PLAYING_STATES.PLAYING:
    //this.start();
    //break;

    //default:
    //this.stop();
    //break;
    //}
    //}

    if (
      [
        SCReduxSequencers.PLAYING_STATES.PLAYING,
        SCReduxSequencers.PLAYING_STATES.STOP_QUEUED
      ].includes(sequencer.playingState) &&
      sequencer.event !== this.lastState.sequencer.event
    ) {
      const event = sequencer.event;
      if (!isRest(event)) {
        if (this.beatPulseTween) {
          this.beatPulseTween.stop();
        }
        const pulseDuration = (event.nextTime / state.tempo) * 60000.0;
        this.beatPulseTween = new TWEEN.Tween({ pulseBrightness: 1.0 }, tweenGroup)
          .to({ pulseBrightness: 0.0 }, pulseDuration)
          .onUpdate(props => {
            this.animationState.pulseBrightness = props.pulseBrightness;
          })
          .start();
      }

      //var i;
      //let pixels = this.params.pixels;
      //let numBeats = sequencer.numBeats;
      //// number of LEDs per beat (if less than one, there are more beats than
      //// LEDS in the strip)
      //let ledsPerBeat = 1.0 * pixels.length / numBeats;
      //// fill all leds with same color (pretty dim)
      //setPixelsColors(pixels, dimLayerColor);

      //// for each beat
      //for (i = 0; i < numBeats; i++) {
      //let ledIndex = Math.floor(ledsPerBeat * i) % pixels.length;

      //// make it brighter
      //setPixelColors(pixels, ledIndex, playingLayerColor);

      //// if this is the current beat
      //if (i === sequencer.beat) {
      //// it is the brightest
      //setPixelColors(pixels, ledIndex, playingBeatColor);
      //}
      //}
    }
    this.lastState.sequencer = sequencer;
  }
  //tick () {
  //}
}

export default SegmentPlayingAnimation;
