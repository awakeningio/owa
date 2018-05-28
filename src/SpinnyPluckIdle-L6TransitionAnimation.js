
/**
 *  @file       SpinnyPluckIdle-L6TransitionAnimation.js
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

    this.build();
  }
  build () {
    var pixels = this.params.pixels;
    var segmentPixels = this.params.segmentPixels;
    setPixelsColors(pixels, Color.hsv(0, 0, 0));

    let initial = {
      brightness: 0
    }; 
    let dest = {
      brightness: 100
    };

    this.level6Seg0Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(150)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .yoyo(true)
      .repeat(1)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_0'],
          Color.hsv(26, 100, props.brightness).mix(Color.hsv(22, 82, 100), 0.1)
        );
      });

    this.level6Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(150)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .yoyo(true)
      .repeat(1)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_1'],
          Color.hsv(27, 100, props.brightness).mix(Color.hsv(32, 100, 100), 0.1)
        );
      });    

    this.level6Seg2Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(150)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .yoyo(true)
      .repeat(1)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_2'],
          Color.hsv(28, 100, props.brightness).mix(Color.hsv(33, 100, 100), 0.1)
        );
      });    

    this.level6Seg3Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(150) 
      .easing(TWEEN.Easing.Sinusoidal.In)
      .yoyo(true)
      .repeat(1)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_3'],
          Color.hsv(29, 100, props.brightness).mix(Color.hsv(34, 100, 100), 0.1)
        );
      }); 

    this.level6Seg4Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(150)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .yoyo(true)
      .repeat(1)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_4'],
          Color.hsv(30, 100, props.brightness).mix(Color.hsv(35, 100, 100), 0.1)
        );
      }); 

    this.level6Seg5Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(150)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .yoyo(true)
      .repeat(1)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_5'],
          Color.hsv(31, 100, props.brightness).mix(Color.hsv(36, 100, 100), 0.1)
        );
      }); 

    this.level4Seg0Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(150)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .yoyo(true)
      .repeat(1)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_0'],
          Color.hsv(32, 100, props.brightness).mix(Color.hsv(37, 100, 100), 0.1)
        );
      }); 

    this.level4Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(150)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .yoyo(true)
      .repeat(1)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_1'],
          Color.hsv(33, 100, props.brightness).mix(Color.hsv(38, 100, 100), 0.1)
        );
      }); 

    this.level4Seg2Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(150)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .yoyo(true)
      .repeat(1)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_2'],
          Color.hsv(34, 100, props.brightness).mix(Color.hsv(39, 100, 100), 0.1)
        );
      }); 

    this.level4Seg3Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(150)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .yoyo(true)
      .repeat(1)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_3'],
          Color.hsv(35, 100, props.brightness).mix(Color.hsv(40, 100, 100), 0.1)
        );
      }); 

    this.level2Seg0Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(150)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .yoyo(true)
      .repeat(1)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_2-segment_0'],
          Color.hsv(36, 100, props.brightness).mix(Color.hsv(41, 100, 100), 0.1)
        );
      }); 

    this.level2Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(150)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .yoyo(true)
      .repeat(1)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_2-segment_1'],
          Color.hsv(37, 100, props.brightness).mix(Color.hsv(42, 100, 100), 0.1)
        );
      }); 
  }
  start () {
    this.level6Seg0Tween.start();
    this.level6Seg1Tween.start();
    this.level6Seg2Tween.start();
    this.level6Seg3Tween.start();
    this.level6Seg4Tween.start();
    this.level6Seg5Tween.start();
    this.level4Seg0Tween.start();
    this.level4Seg1Tween.start();
    this.level4Seg2Tween.start();
    this.level4Seg3Tween.start();
    this.level2Seg0Tween.start();
    this.level2Seg1Tween.start();
  }
  stop () {
    this.level6Seg0Tween.stop();
    this.level6Seg1Tween.stop();
    this.level6Seg2Tween.stop();
    this.level6Seg3Tween.stop();
    this.level6Seg4Tween.stop();
    this.level6Seg5Tween.stop();
    this.level4Seg0Tween.stop();
    this.level4Seg1Tween.stop();
    this.level4Seg2Tween.stop();
    this.level4Seg3Tween.stop();
    this.level2Seg0Tween.stop();
    this.level2Seg1Tween.stop();
    this.build();
  }
}

export default IdleModeAnimation;
