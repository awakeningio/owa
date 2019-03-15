/**
 *  @file       SegmentPlayingAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import Color from 'color';
import TWEEN from '@tweenjs/tween.js';

import awakeningSequencers from 'awakening-sequencers';
import ControllerWithStore from './ControllerWithStore';
import { setPixelColors } from './Pixels';

const dimLayerColor = Color.hsv([0.72 * 360, 20, 20]);
const playingLayerColor = Color.hsv([0.72 * 360, 50, 50]);
//const playingBeatColor = Color.hsv([0.72 * 360, 50, 100]);

class SegmentPlayingAnimation extends ControllerWithStore {
  init() {
    let state = this.store.getState();
    let segment = state.segments.byId[this.params.segmentId];
    let sequencer = state.sequencers[segment.sequencerId];


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
  build () {
    
  }
  start () {
    let state = this.store.getState();
    let tempo = state.tempo;
    let segment = state.segments.byId[this.params.segmentId];
    let sequencer = state.sequencers[segment.sequencerId];
    let duration = sequencer.numBeats / tempo * 60000.0;
    let pixels = this.params.pixels;

    this.stop();

    this.animationState = {
      pulseBrightness: 0.0
    };

    let i, progressPixel;
    this.phaseTween = new TWEEN.Tween({phase: 0.0})
      .to({phase: 1.0}, duration)
      .onUpdate((props) => {
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

      })
      .repeat(Infinity)
      .start();
  }
  stop () {
    if (this.phaseTween) {
      this.phaseTween.stop();
    }
    if (this.beatPulseTween) {
      this.beatPulseTween.stop();
    }
    this.build();
  }
  handle_state_change () {
    let state = this.store.getState();
    let segment = state.segments.byId[this.params.segmentId];
    let sequencer = state.sequencers[segment.sequencerId];

    //if (sequencer.playingState !== this.lastState.sequencer.playingState) {

      //switch (sequencer.playingState) {
        //case awakeningSequencers.PLAYING_STATES.PLAYING:
          //this.start();
          //break;
        
        //default:
          //this.stop();
          //break;
      //}
    //}

    if (
      [
        awakeningSequencers.PLAYING_STATES.PLAYING,
        awakeningSequencers.PLAYING_STATES.STOP_QUEUED
      ].includes(sequencer.playingState)
      && sequencer.event !== this.lastState.sequencer.event
    ) {
      let event = sequencer.event;
      if (event.midinote !== 'rest') {
        if (this.beatPulseTween) {
          this.beatPulseTween.stop();
        }
        let pulseDuration = event.nextTime / state.tempo * 60000.0;
        this.beatPulseTween = new TWEEN.Tween({pulseBrightness: 1.0})
          .to({pulseBrightness: 0.0}, pulseDuration)
          .onUpdate((props) => {
            this.animationState.pulseBrightness = props.pulseBrightness;
          }).start();
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
