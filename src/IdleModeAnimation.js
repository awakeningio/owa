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

    this.tween = new TWEEN.Tween(initial)
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


  }
  start () {
    this.tween.start();
  }
  stop () {
    this.tween.stop();
    this.build();
  }
}

export default IdleModeAnimation;
