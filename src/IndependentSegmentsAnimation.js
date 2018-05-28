


/**
 *  @file      IndependentSegmentsAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 
  
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
      brightness: 80
    };

    this.level6Seg0Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1500)
      .delay(750)
      .easing(TWEEN.Easing.Elastic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_0'],
          Color.hsv(219, 20, props.brightness).mix(Color.hsv(140, 82, 100), 0.3)
        );
      });

    this.level6Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1500)
      .delay(750)
      .easing(TWEEN.Easing.Elastic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_1'],
          Color.hsv(150, 20, props.brightness).mix(Color.hsv(150, 82, 100), 0.3)
        );
      });    

    this.level6Seg2Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1500)
      .delay(750)
      .easing(TWEEN.Easing.Elastic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_2'],
          Color.hsv(160, 20, props.brightness).mix(Color.hsv(160, 82, 100), 0.3)
        );
      });    

    this.level6Seg3Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1500)
      .delay(750) 
      .easing(TWEEN.Easing.Elastic.Out)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_3'],
          Color.hsv(170, 20, props.brightness).mix(Color.hsv(170, 82, 100), 0.3)
        );
      }); 

    this.level6Seg4Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1500)
      .delay(750)
      .easing(TWEEN.Easing.Elastic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_4'],
          Color.hsv(180, 20, props.brightness).mix(Color.hsv(180, 82, 100), 0.3)
        );
      }); 

    this.level6Seg5Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1500)
      .delay(750)
      .easing(TWEEN.Easing.Elastic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_5'],
          Color.hsv(190, 20, props.brightness).mix(Color.hsv(190, 82, 85), 0.3)
        );
      }); 

    this.level4Seg0Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1500)
      .delay(750)
      .easing(TWEEN.Easing.Elastic.Out)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_0'],
          Color.hsv(200, 20, props.brightness).mix(Color.hsv(200, 82, 85), 0.3)
        );
      }); 

    this.level4Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1500)
      .delay(750)
      .easing(TWEEN.Easing.Elastic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_1'],
          Color.hsv(210, 20, props.brightness).mix(Color.hsv(210, 82, 85), 0.3)
        );
      }); 

    this.level4Seg2Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1500)
      .delay(750)
      .easing(TWEEN.Easing.Elastic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_2'],
          Color.hsv(220, 20, props.brightness).mix(Color.hsv(220, 82, 85), 0.3)
        );
      }); 

    this.level4Seg3Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1500)
      .delay(750)
      .easing(TWEEN.Easing.Elastic.Out)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_3'],
          Color.hsv(230, 20, props.brightness).mix(Color.hsv(230, 82, 85), 0.3)
        );
      }); 

    this.level2Seg0Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1500)
      .delay(750)
      .easing(TWEEN.Easing.Elastic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_2-segment_0'],
          Color.hsv(240, 20, props.brightness).mix(Color.hsv(240, 82, 85), 0.3)
        );
      }); 

    this.level2Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1500)
      .delay(750)
      .easing(TWEEN.Easing.Elastic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_2-segment_1'],
          Color.hsv(250, 20, props.brightness).mix(Color.hsv(250, 82, 85), 0.3)
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
**/

/**
 *  @file       AmbientAlienL2IndependentSegmentsAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 
 
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
      brightness: 90
    };

    this.level6Seg0Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(500)
      .easing(TWEEN.Easing.Elastic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_0'],
          Color.hsv(219, 20, props.brightness).mix(Color.hsv(140, 82, 100), 0.3)
        );
      });

    this.level6Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(500)
      .easing(TWEEN.Easing.Elastic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_1'],
          Color.hsv(150, 20, props.brightness).mix(Color.hsv(150, 82, 100), 0.3)
        );
      });    

    this.level6Seg2Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(500)
      .easing(TWEEN.Easing.Elastic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_2'],
          Color.hsv(160, 20, props.brightness).mix(Color.hsv(160, 82, 100), 0.3)
        );
      });    

    this.level6Seg3Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 2000)
      .delay(1000) 
      .easing(TWEEN.Easing.Elastic.Out)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_3'],
          Color.hsv(170, 20, props.brightness).mix(Color.hsv(170, 82, 100), 0.3)
        );
      }); 

    this.level6Seg4Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(500)
      .easing(TWEEN.Easing.Elastic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_4'],
          Color.hsv(180, 20, props.brightness).mix(Color.hsv(180, 82, 100), 0.3)
        );
      }); 

    this.level6Seg5Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(500)
      .easing(TWEEN.Easing.Elastic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_6-segment_5'],
          Color.hsv(190, 20, props.brightness).mix(Color.hsv(190, 82, 85), 0.3)
        );
      }); 

    this.level4Seg0Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(50)
      .easing(TWEEN.Easing.Elastic.Out)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_0'],
          Color.hsv(200, 20, props.brightness).mix(Color.hsv(200, 82, 85), 0.3)
        );
      }); 

    this.level4Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(50)
      .easing(TWEEN.Easing.Elastic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_1'],
          Color.hsv(210, 20, props.brightness).mix(Color.hsv(210, 82, 85), 0.3)
        );
      }); 

    this.level4Seg2Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(500)
      .easing(TWEEN.Easing.Elastic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_2'],
          Color.hsv(220, 20, props.brightness).mix(Color.hsv(220, 82, 85), 0.3)
        );
      }); 

    this.level4Seg3Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(50)
      .easing(TWEEN.Easing.Elastic.Out)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_4-segment_3'],
          Color.hsv(230, 20, props.brightness).mix(Color.hsv(230, 82, 85), 0.3)
        );
      }); 

    this.level2Seg0Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(500)
      .easing(TWEEN.Easing.Elastic.In)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_2-segment_0'],
          Color.hsv(240, 20, props.brightness).mix(Color.hsv(240, 82, 85), 0.3)
        );
      }); 

    this.level2Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      .to(Object.assign({}, dest), 1000)
      .delay(500)
      .easing(TWEEN.Easing.Elastic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        setPixelsColors(
          segmentPixels['level_2-segment_1'],
          Color.hsv(250, 20, props.brightness).mix(Color.hsv(250, 82, 85), 0.3)
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


