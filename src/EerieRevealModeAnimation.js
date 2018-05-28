/**
 *  @file       EerieRevealModeAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import TWEEN from '@tweenjs/tween.js';
import Color from 'color';

import ControllerWithStore from './ControllerWithStore';
import { setPixelsColors } from './Pixels';

class IdleModeAnimation extends ControllerWithStore {
  init() {
    
    this.lastState = {
    };
    this.build();
  }
  build () {
    var pixels = this.params.pixels;
    var levelPixels = this.params.levelPixels;
    // turn all pixels to black
    setPixelsColors(pixels, Color.hsv(0, 0, 0));

    let initial = {
      brightness: 0
    };
    let dest = {
      brightness: 100
    };

    // all at once
    this.allFadeTween = new TWEEN.Tween(initial)
      .to(dest, 100)
      .easing(TWEEN.Easing.Quadratic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          pixels,
          Color.hsv(0, 0, props.brightness)
        );
      });

    this.level6FadeTween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 100)
      .easing(TWEEN.Easing.Quadratic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          levelPixels.level_6,
          Color.hsv(48, 100, props.brightness).mix(Color.hsv(22, 100, 100), 0.4)
        );
      });

    this.level4FadeTween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 100)
      .delay(10)
      .easing(TWEEN.Easing.Quadratic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          levelPixels.level_4,
          Color.hsv(22, 100, props.brightness).mix(Color.hsv(34, 100, 100), 0.4)
        );
      });

    this.level2FadeTween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 100)
      .delay(10)
      .easing(TWEEN.Easing.Quadratic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          levelPixels.level_2,
          Color.hsv(37, 100, props.brightness).mix(Color.hsv(42, 100, 100), 0.4)
        );
      });

  }
  start () {
    //this.allFadeTween.start();
    this.level6FadeTween.start();
    this.level4FadeTween.start();
    this.level2FadeTween.start();
  }
  stop () {
    this.allFadeTween.stop();
    this.level6FadeTween.stop();
    this.level4FadeTween.stop();
    this.level2FadeTween.stop();
    this.build();
  }
}

export default IdleModeAnimation;

