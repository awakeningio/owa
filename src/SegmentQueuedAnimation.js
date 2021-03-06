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
import Color from 'color';
import { setPixelsColors } from './Pixels';

class SegmentQueuedAnimation {
  constructor(params) {
    this.params = params || {};

    this.color = Color.rgb(255, 255, 255);
    this.tween = null;
    this.build();
  }
  build () {
    this.tween = new TWEEN.Tween({
      brightness: 0
    }, this.params.tweenGroup).to({
      brightness: 100
    }, 500).repeat(
      Infinity
    ).yoyo(true).easing(
      TWEEN.Easing.Sinusoidal.InOut
    ).onUpdate((props) => {
      setPixelsColors(this.params.pixels, this.color.value(props.brightness));
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
