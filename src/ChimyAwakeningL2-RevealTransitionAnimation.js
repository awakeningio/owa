/**
 *  @file       ChimyAwakeningL2-RevealTransitionAnimation.js
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
      .to(dest, 320)
      .easing(TWEEN.Easing.Quintic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          pixels,
          Color.hsv(0, 0, props.brightness)
          
        );
      });

    this.level6FadeTween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 320)
      .easing(TWEEN.Easing.Quintic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          levelPixels.level_6,
          Color.hsv(42, 20, props.brightness).mix(Color.hsv(47, 91, 100), 0.3)
        );
        
      });

    this.level4FadeTween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 320)
      .delay(0)
      .easing(TWEEN.Easing.Quintic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          levelPixels.level_4,
          Color.hsv(42, 20, props.brightness).mix(Color.hsv(47, 91, 100), 0.3)
        );
      });

    this.level2FadeTween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 320)
      .delay(0)
      .easing(TWEEN.Easing.Quintic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          levelPixels.level_2,
          Color.hsv(42, 20, props.brightness).mix(Color.hsv(47, 91, 100), 0.3)
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
