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

import awakeningSequencers from 'awakening-sequencers';
import ControllerWithStore from './ControllerWithStore';

const dimLayerColor = Color.hsv([0.72 * 360, 20, 20]);
const playingLayerColor = Color.hsv([0.72 * 360, 50, 50]);
const playingBeatColor = Color.hsv([0.72 * 360, 50, 100]);

class SegmentPlayingAnimation extends ControllerWithStore {
  init() {
    let state = this.store.getState();
    let segment = state.segments.byId[this.params.segmentId];
    let sequencer = state.sequencers[segment.sequencerId];

    this.lastState = {
      sequencer
    };
    this.build();
  }
  build () {
    
  }
  start () {
    
  }
  stop () {
    this.build();
  }
  handle_state_change () {
    let state = this.store.getState();
    let segment = state.segments.byId[this.params.segmentId];
    let sequencer = state.sequencers[segment.sequencerId];

    if (sequencer.playingState !== this.lastState.sequencer.playingState) {
      this.lastState.sequencer = sequencer;

      switch (sequencer.playingState) {
        case awakeningSequencers.PLAYING_STATES.PLAYING:
          this.start();
          break;
        
        default:
          this.stop();
          break;
      }
    }

    if (
      sequencer.playingState === awakeningSequencers.PLAYING_STATES.PLAYING
      && sequencer.beat !== this.lastState.sequencer.beat
    ) {
      this.lastState.sequencer = sequencer;
      let pixels = this.params.pixels;
      let numBeats = sequencer.numBeats;
      // number of LEDs per beat (if less than one, there are more beats than
      // LEDS in the strip)
      let ledsPerBeat = 1.0 * pixels.length / numBeats;
      let i = 0;
      // fill all leds with same color (pretty dim)
      for (i = 0; i < pixels.length; i++) {
        pixels.setPixel.apply(pixels, [i].concat(dimLayerColor.color));
      }
      // for each beat
      for (i = 0; i < numBeats; i++) {
        let ledIndex = Math.floor(ledsPerBeat * i) % pixels.length;

        // make it brighter
        pixels.setPixel.apply(
          pixels,
          [ledIndex].concat(playingLayerColor.color)
        );

        // if this is the current beat
        if (i === sequencer.beat) {
          // it is the brightest
          pixels.setPixel.apply(
            pixels,
            [ledIndex].concat(playingBeatColor.color)
          );
        }
      }
    }
  }
}

export default SegmentPlayingAnimation;
