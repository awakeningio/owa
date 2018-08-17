

/**
 *  @file       SpinnyPluckRevealModeAnimation.js
 *
 *
 *  @author     Emma Lefley
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import TWEEN from '@tweenjs/tween.js';
import Color from 'color';

import ControllerWithStore from './ControllerWithStore';
import { setPixelsColors } from './Pixels';
import { SESSION_PHASES } from './constants';

class RevealAnimation extends ControllerWithStore {
  init() {
    this.prevState = {
      sessionPhase: null
    };
    this.initial = {
      brightness: 0
    }; 
    this.build();
  }
  createSegmentTween (segmentId, dur, delay, easing) {
    let pixels = this.params.segmentPixels[segmentId];
    let color = this.segmentColors[segmentId];
    return new TWEEN.Tween(Object.assign({}, this.segmentTweenState[segmentId]))
      .to({
        brightness: 100
      }, dur)
      .delay(delay)
      .easing(easing)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate((props) => {
        Object.assign(this.segmentTweenState[segmentId], props);
        setPixelsColors(
          pixels,
          color.value(props.brightness)
        )
      });
  }
  build () {

    this.segmentTweenState = {
      'level_6-segment_0': Object.assign({}, this.initial),
      'level_6-segment_1': Object.assign({}, this.initial),
      'level_6-segment_2': Object.assign({}, this.initial),
      'level_6-segment_3': Object.assign({}, this.initial),
      'level_6-segment_4': Object.assign({}, this.initial),
      'level_6-segment_5': Object.assign({}, this.initial),
      'level_4-segment_0': Object.assign({}, this.initial),
      'level_4-segment_1': Object.assign({}, this.initial),
      'level_4-segment_2': Object.assign({}, this.initial),
      'level_4-segment_3': Object.assign({}, this.initial),
      'level_2-segment_0': Object.assign({}, this.initial),
      'level_2-segment_1': Object.assign({}, this.initial)
    };
    this.segmentColors = {
			'level_6-segment_0': Color.hsv(26, 100, 255).mix(
				Color.hsv(22, 82, 100),
				0.1
			),
			'level_6-segment_1': Color.hsv(27, 100, 255).mix(
				Color.hsv(32, 100, 100),
				0.1
			),
			'level_6-segment_2': Color.hsv(28, 100, 255).mix(
				Color.hsv(33, 100, 100),
				0.1
			),
			'level_6-segment_3': Color.hsv(29, 100, 255).mix(
				Color.hsv(34, 100, 100),
				0.1
			),
			'level_6-segment_4': Color.hsv(30, 100, 255).mix(
				Color.hsv(35, 100, 100),
				0.1
			),
			'level_6-segment_5': Color.hsv(31, 100, 255).mix(
				Color.hsv(36, 100, 100),
				0.1
			),
			'level_4-segment_0': Color.hsv(32, 100, 255).mix(
				Color.hsv(37, 100, 100),
				0.1
			),
			'level_4-segment_1': Color.hsv(33, 100, 255).mix(
				Color.hsv(38, 100, 100),
				0.1
			),
			'level_4-segment_2': Color.hsv(34, 100, 255).mix(
				Color.hsv(39, 100, 100),
				0.1
			),
			'level_4-segment_3': Color.hsv(35, 100, 255).mix(
				Color.hsv(40, 100, 100),
				0.1
			),
			'level_2-segment_0': Color.hsv(36, 100, 255).mix(
				Color.hsv(41, 100, 100),
				0.1),
			'level_2-segment_1': Color.hsv(37, 100, 255).mix(
				Color.hsv(42, 100, 100),
				0.1
			)
		};


    this.segmentTweens = {
      'level_6-segment_0': this.createSegmentTween(
        'level_6-segment_0',
        100,
        50,
        TWEEN.Easing.Sinusoidal.In
      ),
      'level_6-segment_1': this.createSegmentTween(
        'level_6-segment_1',
        100,
        50,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      'level_6-segment_2': this.createSegmentTween(
        'level_6-segment_2',
        100,
        50,
        TWEEN.Easing.Sinusoidal.Out
      ),
      'level_6-segment_3': this.createSegmentTween(
        'level_6-segment_3',
        100,
        50,
        TWEEN.Easing.Sinusoidal.In
      ),
      'level_6-segment_4': this.createSegmentTween(
        'level_6-segment_4',
        100,
        50,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      'level_6-segment_5': this.createSegmentTween(
        'level_6-segment_5',
        100,
        50,
        TWEEN.Easing.Sinusoidal.Out
      ),
      'level_4-segment_0': this.createSegmentTween(
        'level_4-segment_0',
        100,
        50,
        TWEEN.Easing.Sinusoidal.In
      ),
      'level_4-segment_1': this.createSegmentTween(
        'level_4-segment_1',
        100,
        50,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      'level_4-segment_2': this.createSegmentTween(
        'level_4-segment_2',
        100,
        50,
        TWEEN.Easing.Sinusoidal.Out
      ),
      'level_4-segment_3': this.createSegmentTween(
        'level_4-segment_3',
        100,
        50,
        TWEEN.Easing.Sinusoidal.In
      ),
      'level_2-segment_0': this.createSegmentTween(
        'level_2-segment_0',
        100,
        50,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      'level_2-segment_1': this.createSegmentTween(
        'level_2-segment_1',
        100,
        50,
        TWEEN.Easing.Sinusoidal.Out
      )
    };

    //this.level6Seg0Tween = new TWEEN.Tween(Object.assign({}, initial))
      //.to(Object.assign({}, dest), 50)
      //.delay(5)
      //.easing(TWEEN.Easing.Back.In)
      //.yoyo(true)
      //.repeat(Infinity)
      //.onUpdate((props) => {
        //setPixelsColors(
          //segmentPixels['level_6-segment_0'],
          //Color.hsv(26, 100, props.brightness).mix(Color.hsv(22, 82, 100), 0.2)
        //);
      //});

    //this.level6Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      //.to(Object.assign({}, dest), 50)
      //.delay(5)
      //.easing(TWEEN.Easing.Back.InOut)
      //.yoyo(true)
      //.repeat(Infinity)
      //.onUpdate((props) => {
        //setPixelsColors(
          //segmentPixels['level_6-segment_1'],
          //Color.hsv(27, 100, props.brightness).mix(Color.hsv(32, 100, 100), 0.2)
        //);
      //});    

    //this.level6Seg2Tween = new TWEEN.Tween(Object.assign({}, initial))
      //.to(Object.assign({}, dest), 50)
      //.delay(5)
      //.easing(TWEEN.Easing.Back.Out)
      //.yoyo(true)
      //.repeat(Infinity)
      //.onUpdate((props) => {
        //setPixelsColors(
          //segmentPixels['level_6-segment_2'],
          //Color.hsv(28, 100, props.brightness).mix(Color.hsv(33, 100, 100), 0.2)
        //);
      //});    

    //this.level6Seg3Tween = new TWEEN.Tween(Object.assign({}, initial))
      //.to(Object.assign({}, dest), 50)
      //.delay(5) 
      //.easing(TWEEN.Easing.Back.In)
      //.yoyo(true)
      //.repeat(Infinity)
      //.onUpdate((props) => {
        //setPixelsColors(
          //segmentPixels['level_6-segment_3'],
          //Color.hsv(29, 100, props.brightness).mix(Color.hsv(34, 100, 100), 0.2)
        //);
      //}); 

    //this.level6Seg4Tween = new TWEEN.Tween(Object.assign({}, initial))
      //.to(Object.assign({}, dest), 50)
      //.delay(5)
      //.easing(TWEEN.Easing.Back.InOut)
      //.yoyo(true)
      //.repeat(Infinity)
      //.onUpdate((props) => {
        //setPixelsColors(
          //segmentPixels['level_6-segment_4'],
          //Color.hsv(30, 100, props.brightness).mix(Color.hsv(35, 100, 100), 0.2)
        //);
      //}); 

    //this.level6Seg5Tween = new TWEEN.Tween(Object.assign({}, initial))
      //.to(Object.assign({}, dest), 50)
      //.delay(5)
      //.easing(TWEEN.Easing.Back.Out)
      //.yoyo(true)
      //.repeat(Infinity)
      //.onUpdate((props) => {
        //setPixelsColors(
          //segmentPixels['level_6-segment_5'],
          //Color.hsv(31, 100, props.brightness).mix(Color.hsv(36, 100, 100), 0.2)
        //);
      //}); 

    //this.level4Seg0Tween = new TWEEN.Tween(Object.assign({}, initial))
      //.to(Object.assign({}, dest), 50)
      //.delay(5)
      //.easing(TWEEN.Easing.Back.In)
      //.yoyo(true)
      //.repeat(Infinity)
      //.onUpdate((props) => {
        //setPixelsColors(
          //segmentPixels['level_4-segment_0'],
          //Color.hsv(32, 100, props.brightness).mix(Color.hsv(37, 100, 100), 0.2)
        //);
      //}); 

    //this.level4Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      //.to(Object.assign({}, dest), 50)
      //.delay(5)
      //.easing(TWEEN.Easing.Back.InOut)
      //.yoyo(true)
      //.repeat(Infinity)
      //.onUpdate((props) => {
        //setPixelsColors(
          //segmentPixels['level_4-segment_1'],
          //Color.hsv(33, 100, props.brightness).mix(Color.hsv(38, 100, 100), 0.2)
        //);
      //}); 

    //this.level4Seg2Tween = new TWEEN.Tween(Object.assign({}, initial))
      //.to(Object.assign({}, dest), 50)
      //.delay(5)
      //.easing(TWEEN.Easing.Back.Out)
      //.yoyo(true)
      //.repeat(Infinity)
      //.onUpdate((props) => {
        //setPixelsColors(
          //segmentPixels['level_4-segment_2'],
          //Color.hsv(34, 100, props.brightness).mix(Color.hsv(39, 100, 100), 0.2)
        //);
      //}); 

    //this.level4Seg3Tween = new TWEEN.Tween(Object.assign({}, initial))
      //.to(Object.assign({}, dest), 50)
      //.delay(5)
      //.easing(TWEEN.Easing.Back.In)
      //.yoyo(true)
      //.repeat(Infinity)
      //.onUpdate((props) => {
        //setPixelsColors(
          //segmentPixels['level_4-segment_3'],
          //Color.hsv(35, 100, props.brightness).mix(Color.hsv(40, 100, 100), 0.2)
        //);
      //}); 

    //this.level2Seg0Tween = new TWEEN.Tween(Object.assign({}, initial))
      //.to(Object.assign({}, dest), 50)
      //.delay(5)
      //.easing(TWEEN.Easing.Back.InOut)
      //.yoyo(true)
      //.repeat(Infinity)
      //.onUpdate((props) => {
        //setPixelsColors(
          //segmentPixels['level_2-segment_0'],
          //Color.hsv(36, 100, props.brightness).mix(Color.hsv(41, 100, 100), 0.2)
        //);
      //}); 

    //this.level2Seg1Tween = new TWEEN.Tween(Object.assign({}, initial))
      //.to(Object.assign({}, dest), 50)
      //.delay(5)
      //.easing(TWEEN.Easing.Back.Out)
      //.yoyo(true)
      //.repeat(Infinity)
      //.onUpdate((props) => {
        //setPixelsColors(
          //segmentPixels['level_2-segment_1'],
          //Color.hsv(37, 100, props.brightness).mix(Color.hsv(42, 100, 100), 0.2)
        //);
      //}); 
  }
  buildPlayingAdvice () {
    // colors change suddenly
    [
      'level_6-segment_0',
      'level_6-segment_1',
      'level_6-segment_2',
      'level_6-segment_3',
      'level_6-segment_4',
      'level_6-segment_5',
      'level_4-segment_0',
      'level_4-segment_1',
      'level_4-segment_2',
      'level_4-segment_3',
      'level_2-segment_0',
      'level_2-segment_1'
    ].forEach((segmentId) => {
      let color = this.segmentColors[segmentId];
      this.segmentColors[segmentId] = color.hue(
        color.hue() + (Math.random() * 10)
      );
    });
    
    this.segmentTweens = {
      'level_6-segment_0': this.createSegmentTween(
        'level_6-segment_0',
        50,
        5,
        TWEEN.Easing.Sinusoidal.In
      ),
      'level_6-segment_1': this.createSegmentTween(
        'level_6-segment_1',
        50,
        5,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      'level_6-segment_2': this.createSegmentTween(
        'level_6-segment_2',
        50,
        5,
        TWEEN.Easing.Sinusoidal.Out
      ),
      'level_6-segment_3': this.createSegmentTween(
        'level_6-segment_3',
        50,
        5,
        TWEEN.Easing.Sinusoidal.In
      ),
      'level_6-segment_4': this.createSegmentTween(
        'level_6-segment_4',
        50,
        5,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      'level_6-segment_5': this.createSegmentTween(
        'level_6-segment_5',
        50,
        5,
        TWEEN.Easing.Sinusoidal.Out
      ),
      'level_4-segment_0': this.createSegmentTween(
        'level_4-segment_0',
        50,
        5,
        TWEEN.Easing.Sinusoidal.In
      ),
      'level_4-segment_1': this.createSegmentTween(
        'level_4-segment_1',
        50,
        5,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      'level_4-segment_2': this.createSegmentTween(
        'level_4-segment_2',
        50,
        5,
        TWEEN.Easing.Sinusoidal.Out
      ),
      'level_4-segment_3': this.createSegmentTween(
        'level_4-segment_3',
        50,
        5,
        TWEEN.Easing.Sinusoidal.In
      ),
      'level_2-segment_0': this.createSegmentTween(
        'level_2-segment_0',
        50,
        5,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      'level_2-segment_1': this.createSegmentTween(
        'level_2-segment_1',
        50,
        5,
        TWEEN.Easing.Sinusoidal.Out
      )
    };

  }
  start () {
    this.build();
    Object.keys(this.segmentTweens).forEach((segmentId) => {
      this.segmentTweens[segmentId].start();
    });
  }
  startAdvice () {
    this.stop();
    this.buildPlayingAdvice();
    Object.keys(this.segmentTweens).forEach((segmentId) => {
      this.segmentTweens[segmentId].start();
    });
  }
  stop () {
    Object.keys(this.segmentTweens).forEach((segmentId) => {
      this.segmentTweens[segmentId].stop();
    });
  }
  handle_state_change () {
    let state = this.store.getState();

    if (this.prevState.sessionPhase !== state.sessionPhase) {
      this.prevState.sessionPhase = state.sessionPhase;

      switch (state.sessionPhase) {
        case SESSION_PHASES.TRANS_ADVICE:
          this.start();
          break;

        case SESSION_PHASES.PLAYING_ADVICE:
          this.startAdvice();
          break;

        default:
          this.stop();
          break;
      }
    }

  }
}

export default RevealAnimation;
