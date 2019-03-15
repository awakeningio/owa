
/**
 *  @file       EminatorTrans4Animation.js
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

import { setPixelsColors } from './Pixels';
import Trans4Animation from './Trans4Animation';

class EminatorTrans4Animation extends Trans4Animation {
  build () {
    const initial = {
      brightness: 0
    };
    const dest = {
      brightness: 100
    };

    this.segmentColors = {
      'level_6-segment_0': Color.hsv(233, 60, 100).mix(
        Color.hsv(22, 82, 100),
        0.1
      ),
      'level_6-segment_1': Color.hsv(233, 60, 100).mix(
        Color.hsv(32, 100, 100),
        0.1
      ),
      'level_6-segment_2': Color.hsv(233, 60, 100).mix(
        Color.hsv(33, 100, 100),
        0.1
      ),
      'level_6-segment_3': Color.hsv(233, 60, 100).mix(
        Color.hsv(34, 100, 100),
        0.1
      ),
      'level_6-segment_4': Color.hsv(233, 60, 100).mix(
        Color.hsv(35, 100, 100),
        0.1
      ),
      'level_6-segment_5': Color.hsv(233, 60, 100).mix(
        Color.hsv(36, 100, 100),
        0.1
      ),
      'level_4-segment_0': Color.hsv(233, 60, 100).mix(
        Color.hsv(37, 100, 100),
        0.1
      ),
      'level_4-segment_1': Color.hsv(233, 60, 100).mix(
        Color.hsv(38, 100, 100),
        0.1
      ),
      'level_4-segment_2': Color.hsv(233, 60, 100).mix(
        Color.hsv(39, 100, 100),
        0.1
      ),
      'level_4-segment_3': Color.hsv(233, 60, 100).mix(
        Color.hsv(40, 100, 100),
        0.1
      ),
      'level_2-segment_0': Color.hsv(233, 60, 100).mix(
        Color.hsv(41, 100, 100),
        0.1
      ),
      'level_2-segment_1': Color.hsv(233, 60, 100).mix(
        Color.hsv(42, 100, 100),
        0.1
      )
    };

    const createSegmentTween = (segmentId) => {
      const segmentPixels = this.params.segmentPixels;
      const segmentColors = this.segmentColors;
      return new TWEEN.Tween(Object.assign({}, initial))
        .to(Object.assign({}, dest), 3000)
        .delay(Math.random() * 5000 + 50)
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
    Object.keys(this.segmentTweens).forEach((segmentId) => {
      this.segmentTweens[segmentId].start();
    });
  }
  stop () {
    Object.keys(this.segmentTweens).forEach((segmentId) => {
      this.segmentTweens[segmentId].stop();
    });
  }
}

export default EminatorTrans4Animation;
