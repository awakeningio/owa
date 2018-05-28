
/**
 *  @file       AmbientAlienRevealIndependentSegmentsAnimation.js
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
      .to(Object.assign({}, dest), 2000)
      .delay(150)
      .easing(TWEEN.Easing.Bounce.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_0'],
          Color.hsv(0, 95, props.brightness).mix(Color.hsv(0, 91, 62), 0.2)
        );
      });

    this.level6Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 2000)
      .delay(150)
      .easing(TWEEN.Easing.Bounce.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_1'],
          Color.hsv(0, 95, props.brightness).mix(Color.hsv(0, 91, 62), 0.2)
        );
      });    

    this.level6Seg2Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 2000)
      .delay(150)
      .easing(TWEEN.Easing.Bounce.Out)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_2'],
          Color.hsv(0, 95, props.brightness).mix(Color.hsv(0, 91, 62), 0.2)
        );
      });    

    this.level6Seg3Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 2000)
      .delay(150)
      .easing(TWEEN.Easing.Bounce.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_3'],
          Color.hsv(0, 95, props.brightness).mix(Color.hsv(0, 91, 62), 0.2)
        );
      }); 

    this.level6Seg4Tween = new TWEEN.Tween(Object.assign({}, initial))
       .to(Object.assign({}, dest), 2000)
      .delay(150)
      .easing(TWEEN.Easing.Bounce.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_4'],
          Color.hsv(0, 95, props.brightness).mix(Color.hsv(0, 91, 62), 0.2)
        );
      }); 

    this.level6Seg5Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 2000)
      .delay(150)
      .easing(TWEEN.Easing.Bounce.Out)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_5'],
          Color.hsv(0, 95, props.brightness).mix(Color.hsv(0, 91, 62), 0.2)
        );
      }); 

    this.level4Seg0Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 2000)
      .delay(150)
      .easing(TWEEN.Easing.Bounce.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_0'],
          Color.hsv(0, 95, props.brightness).mix(Color.hsv(0, 91, 62), 0.2)
        );
      }); 

    this.level4Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 2000)
      .delay(150)
      .easing(TWEEN.Easing.Bounce.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_1'],
          Color.hsv(0, 95, props.brightness).mix(Color.hsv(0, 91, 62), 0.2)
        );
      }); 

    this.level4Seg2Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 2000)
      .delay(150)
      .easing(TWEEN.Easing.Bounce.Out)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_2'],
          Color.hsv(0, 95, props.brightness).mix(Color.hsv(0, 91, 62), 0.2)
        );
      }); 

    this.level4Seg3Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 2000)
      .delay(150)
      .easing(TWEEN.Easing.Bounce.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_3'],
          Color.hsv(0, 95, props.brightness).mix(Color.hsv(0, 91, 62), 0.2)
        );
      }); 

    this.level2Seg0Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 2000)
      .delay(150)
      .easing(TWEEN.Easing.Bounce.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_2-segment_0'],
          Color.hsv(0, 95, props.brightness).mix(Color.hsv(0, 91, 62), 0.2)
        );
      }); 

    this.level2Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 2000)
      .delay(150)
      .easing(TWEEN.Easing.Bounce.Out)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_2-segment_1'],
          Color.hsv(0, 95, props.brightness).mix(Color.hsv(0, 91, 62), 0.2)
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
