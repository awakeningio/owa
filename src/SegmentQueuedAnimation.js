/**
 *  @file       SegmentQueuedAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/
import TWEEN from '@tweenjs/tween.js';

class SegmentQueuedAnimation {
  constructor(params) {
    this.params = params || {};

    this.tween = null;
    this.build();
  }
  build () {
    this.tween = new TWEEN.Tween({
      brightness: 0.0
    }).to({
      brightness: 1.0
    }, 500).repeat(
      Infinity
    ).yoyo(true).easing(
      TWEEN.Easing.Sinusoidal.InOut
    ).onUpdate((props) => {
      let i, pixels = this.params.pixels;
      for (i = 0; i < pixels.length; i++) {
        pixels.setPixel(
          i,
          255 * props.brightness,
          255 * props.brightness,
          255 * props.brightness
        );
      }
    });
  }
  start () {
    this.build();
    this.tween.start();
  }
  stop () {
    this.tween.stop();
  }
}

export default SegmentQueuedAnimation;
