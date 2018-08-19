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

      let onUpdate = function (props) {
        setPixelsColors(
          pixels,
          color.value(props.value)
        )
      };

      let inTween = new TWEEN.Tween({value: 0})
        .to({value: 255}, periodLength)
        .easing(TWEEN.Easing.Circular.In)
        .onUpdate(onUpdate)
        .onComplete(function (props) {
          props.value = 0;
        });

      let outTween = new TWEEN.Tween({value: 255})
        .to({value: 0}, periodLength)
        .easing(TWEEN.Easing.Circular.Out)
        .onUpdate(onUpdate)
        .onComplete(function (props) {
          props.value = 255;
        });
      inTween.chain(outTween);
      outTween.chain(inTween);
      return inTween;
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
    this.segmentIds.forEach((segmentId) => {
      this.segmentTweens[segmentId].stop();
    });
  }
}

export default LevelReadyAnimation;
