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

    this.color = Color.hsv(5, 100, 100);
    this.onUpdate = (props) => {
      setPixelsColors(
        this.props.pixels,
        this.color.value(props.brightness * 100)
      );
    };
    
    this.build();
  }

  build () {
    const { tweenGroup } = this.props;
    const dur = 100;
    const maxBrightness = 0.5;
    const brightnessUpTween = new TWEEN.Tween({
      brightness: 0.0
    }, tweenGroup).to({
      brightness: maxBrightness
    }, dur).easing(
      TWEEN.Easing.Sinusoidal.In
    ).onUpdate(this.onUpdate);
    const brightnessDownTween = new TWEEN.Tween({
      brightness: maxBrightness
    }, tweenGroup).to({
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
