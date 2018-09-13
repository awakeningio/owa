/**
 *  @file       SegmentNoopAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import TWEEN from '@tweenjs/tween.js';
import { setPixelsColors } from './Pixels';
import Color from 'color';

class SegmentNoopAnimation {
  constructor(props) {

    this.props = props;

    this.tween = null;

    this.color = Color.hsv(5, 255, 255);
    this.onUpdate = (props) => {
      setPixelsColors(
        this.props.pixels,
        this.color.value(props.brightness * 255)
      );
    };
    
    this.build();
  }

  build () {
    let dur = 100;
    let maxBrightness = 0.5;
    let brightnessUpTween = new TWEEN.Tween({
      brightness: 0.0
    }).to({
      brightness: maxBrightness
    }, dur).easing(
      TWEEN.Easing.Sinusoidal.In
    ).onUpdate(this.onUpdate);
    let brightnessDownTween = new TWEEN.Tween({
      brightness: maxBrightness
    }).to({
      brightness: 0.0
    }, dur).easing(
      TWEEN.Easing.Sinusoidal.Out
    ).onUpdate(this.onUpdate);
    brightnessUpTween.chain(brightnessDownTween);
    this.tween = brightnessUpTween;
  }

  start () {
    this.tween.start();
  }

  stop () {
    this.tween.stop();
  }
}

export default SegmentNoopAnimation;
