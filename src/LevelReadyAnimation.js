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
    this.levelReadyState = this.params.levelReadySelector(
      this.store.getState()
    );
  }
  build () {

    const createSegmentColor = function () {
      const hue = (
        32 + ((Math.random() - 0.5) * 8)
      );
      return Color.hsv(
        hue,
        100,
        100
      );
    };

    const createSegmentTween = (segmentId) => {

      const state = this.store.getState();
      const { tweenGroup } = this.params;
      const pixels = this.params.segmentPixels[segmentId];
      const color = this.segmentColors[segmentId];
      const tempo = state.tempo;

      const periodMs = 2000;

      return new TWEEN.Tween({value: 0}, tweenGroup)
        .to({value: 100}, periodMs)
        .easing(TWEEN.Easing.Circular.In)
        .repeat(Infinity)
        .yoyo(true)
        .delay(this.params.delayBeats / tempo * 60000.0)
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

  handle_state_change () {
    const state = this.store.getState();
    const levelReadySelector = this.params.levelReadySelector;
    const levelReadyState = levelReadySelector(state);

    if (levelReadyState !== this.levelReadyState) {
      this.levelReadyState = levelReadyState;

      if (levelReadyState) {
        this.build();
        this.start();
      } else {
        this.stop();
      }
    }
  }
}

export default LevelReadyAnimation;
