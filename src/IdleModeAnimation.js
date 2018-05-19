/**
 *  @file       IdleModeAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import TWEEN from '@tweenjs/tween.js';

import ControllerWithStore from './ControllerWithStore';

class IdleModeAnimation extends ControllerWithStore {
  init() {
    
    this.lastState = {
    };
    this.build();
  }
  build () {
    var i;
    // turn all pixels to black
    for (i = 0; i < this.params.pixels.length; i++) {
      this.params.pixels.setPixel(i, 0, 0, 0);
    }

    let initial = {
      brightness: 0
    };
    let dest = {
      brightness: 1
    };

    // all at once
    this.allFadeTween = new TWEEN.Tween(initial)
      .to(dest, 4000)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        var i;
        // turn all pixels to black
        for (i = 0; i < this.params.pixels.length; i++) {
          this.params.pixels.setPixel(i, props.brightness * 255, props.brightness * 255, props.brightness * 255);
        }
      });

    this.level6FadeTween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 4000)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        var i;
        // turn all pixels to black
        for (i = 0; i < this.params.levelPixels.level_6.length; i++) {
          this.params.levelPixels.level_6.setPixel(i, props.brightness * 255, props.brightness * 255, props.brightness * 255);
        }
      });

    this.level4FadeTween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 4000)
      .delay(500)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        var i;
        // turn all pixels to black
        for (i = 0; i < this.params.levelPixels.level_4.length; i++) {
          this.params.levelPixels.level_4.setPixel(i, props.brightness * 255, props.brightness * 255, props.brightness * 255);
        }
      });

    this.level2FadeTween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 4000)
      .delay(1000)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        var i;
        // turn all pixels to black
        for (i = 0; i < this.params.levelPixels.level_2.length; i++) {
          this.params.levelPixels.level_2.setPixel(i, props.brightness * 255, props.brightness * 255, props.brightness * 255);
        }
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
