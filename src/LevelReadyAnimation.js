/**
 *  @file       LevelReadyAnimation.js
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
import { getSegmentIdsForLevel } from './selectors';

class LevelReadyAnimation extends ControllerWithStore {
  init () {
    this.segmentIds = getSegmentIdsForLevel(this.params.levelId);
  }
  build () {

    let createSegmentColor = function () {
      let hue = (
        32 + ((Math.random() - 0.5) * 8)
      );
      return Color.hsv(
        hue,
        100,
        255
      );
    };

    let createSegmentTween = (segmentId) => {

      let pixels = this.params.segmentPixels[segmentId];
      let color = this.segmentColors[segmentId];

      let periodLength = 2000;

      return new TWEEN.Tween({value: 0})
        .to({value: 255}, periodLength)
        .easing(TWEEN.Easing.Circular.In)
        .repeat(Infinity)
        .yoyo(true)
        .onUpdate(function (props) {
          setPixelsColors(
            pixels,
            color.value(props.value)
          )
        });
    };

    this.segmentColors = {};
    this.segmentTweens = {};
    this.segmentIds.forEach((segmentId) => {
      this.segmentColors[segmentId] = createSegmentColor();
      this.segmentTweens[segmentId] = createSegmentTween(segmentId);
    });
  }

  start () {
    this.build();
    this.segmentIds.forEach((segmentId) => {
      this.segmentTweens[segmentId].start();
    });
  }

  stop () {
    if (this.segmentTweens) {
      this.segmentIds.forEach((segmentId) => {
        this.segmentTweens[segmentId].stop();
      });
    }
  }
}

export default LevelReadyAnimation;
