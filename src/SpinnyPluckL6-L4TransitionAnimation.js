
/**
 *  @file       SpinnyPluckL6-L4TransitionAnimation.js
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

class Level4TransitionAnimation extends ControllerWithStore {
  init() {
    this.prevState = {
      sessionPhase: null
    };
    this.build();
  }
  build () {
    let initial = {
      brightness: 0
    }; 
    let dest = {
      brightness: 100
    };

    this.segmentColors = {
      'level_6-segment_0': Color.hsv(26, 100, 100).mix(
        Color.hsv(22, 82, 100),
        0.1
      ),
      'level_6-segment_1': Color.hsv(27, 100, 100).mix(
        Color.hsv(32, 100, 100),
        0.1
      ),
      'level_6-segment_2': Color.hsv(28, 100, 100).mix(
        Color.hsv(33, 100, 100),
        0.1
      ),
      'level_6-segment_3': Color.hsv(29, 100, 100).mix(
        Color.hsv(34, 100, 100),
        0.1
      ),
      'level_6-segment_4': Color.hsv(30, 100, 100).mix(
        Color.hsv(35, 100, 100),
        0.1
      ),
      'level_6-segment_5': Color.hsv(31, 100, 100).mix(
        Color.hsv(36, 100, 100),
        0.1
      ),
      'level_4-segment_0': Color.hsv(32, 100, 100).mix(
        Color.hsv(37, 100, 100),
        0.1
      ),
      'level_4-segment_1': Color.hsv(33, 100, 100).mix(
        Color.hsv(38, 100, 100),
        0.1
      ),
      'level_4-segment_2': Color.hsv(34, 100, 100).mix(
        Color.hsv(39, 100, 100),
        0.1
      ),
      'level_4-segment_3': Color.hsv(35, 100, 100).mix(
        Color.hsv(40, 100, 100),
        0.1
      ),
      'level_2-segment_0': Color.hsv(36, 100, 100).mix(
        Color.hsv(41, 100, 100),
        0.1
      ),
      'level_2-segment_1': Color.hsv(37, 100, 100).mix(
        Color.hsv(42, 100, 100),
        0.1
      )
    };

    let createSegmentTween = (segmentId) => {
      let segmentPixels = this.params.segmentPixels;
      let segmentColors = this.segmentColors;
      return new TWEEN.Tween(Object.assign({}, initial))
        .to(Object.assign({}, dest), 3000)
        .delay(1000)
        .yoyo(true)
        .repeat(1)
        .onUpdate((props) => {
          setPixelsColors(
            segmentPixels[segmentId],
            segmentColors[segmentId].value(props.brightness)
          )
        })
    };

    this.segmentTweens = {
      'level_6-segment_0': createSegmentTween('level_6-segment_0')
      .easing(TWEEN.Easing.Sinusoidal.In),
      'level_6-segment_1': createSegmentTween('level_6-segment_1')
      .easing(TWEEN.Easing.Sinusoidal.InOut),
      'level_6-segment_2': createSegmentTween('level_6-segment_2')
      .easing(TWEEN.Easing.Sinusoidal.Out),
      'level_6-segment_3': createSegmentTween('level_6-segment_3')
      .easing(TWEEN.Easing.Sinusoidal.In),
      'level_6-segment_4': createSegmentTween('level_6-segment_4')
      .easing(TWEEN.Easing.Sinusoidal.InOut),
      'level_6-segment_5': createSegmentTween('level_6-segment_5')
      .easing(TWEEN.Easing.Sinusoidal.Out),
      'level_4-segment_0': createSegmentTween('level_4-segment_0')
      .easing(TWEEN.Easing.Sinusoidal.In),
      'level_4-segment_1': createSegmentTween('level_4-segment_1')
      .easing(TWEEN.Easing.Sinusoidal.InOut),
      'level_4-segment_2': createSegmentTween('level_4-segment_2')
      .easing(TWEEN.Easing.Sinusoidal.Out),
      'level_4-segment_3': createSegmentTween('level_4-segment_3')
      .easing(TWEEN.Easing.Sinusoidal.In),
      'level_2-segment_0': createSegmentTween('level_2-segment_0')
      .easing(TWEEN.Easing.Sinusoidal.InOut),
      'level_2-segment_1': createSegmentTween('level_2-segment_1')
      .easing(TWEEN.Easing.Sinusoidal.Out)
    };


  }
  start () {
    this.build();
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
        case SESSION_PHASES.TRANS_4:
          this.start();
          break;

        default:
          this.stop();
          break;
      }
    }

  }
}

export default Level4TransitionAnimation;
