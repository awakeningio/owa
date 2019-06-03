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

import TWEEN from "@tweenjs/tween.js";
import Color from "color";

import ControllerWithStore from "./ControllerWithStore";
import { setPixelsColors } from "./Pixels";
import { SESSION_PHASES } from "owa/constants";

const SLOW_FLASH_DUR = 100;
const SLOW_FLASH_DEL = 50;

const FAST_FLASH_DUR = 50;
const FAST_FLASH_DEL = 5;

class SpinnyPluckRevealAnimation extends ControllerWithStore {
  init() {
    this.prevState = {
      sessionPhase: null
    };
    this.initial = {
      brightness: 0
    };
    this.build();
  }
  createSegmentTween(segmentId, dur, delay, easing) {
    const { tweenGroup } = this.params;
    const pixels = this.params.segmentPixels[segmentId];
    const color = this.segmentColors[segmentId];
    return new TWEEN.Tween({...this.segmentTweenState[segmentId]}, tweenGroup)
      .to(
        {
          brightness: 100
        },
        dur
      )
      .delay(delay)
      .easing(easing)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate(props => {
        Object.assign(this.segmentTweenState[segmentId], props);
        setPixelsColors(pixels, color.value(props.brightness));
      });
  }
  build() {
    this.segmentTweenState = {
      "level_6-segment_0": Object.assign({}, this.initial),
      "level_6-segment_1": Object.assign({}, this.initial),
      "level_6-segment_2": Object.assign({}, this.initial),
      "level_6-segment_3": Object.assign({}, this.initial),
      "level_6-segment_4": Object.assign({}, this.initial),
      "level_6-segment_5": Object.assign({}, this.initial),
      "level_4-segment_0": Object.assign({}, this.initial),
      "level_4-segment_1": Object.assign({}, this.initial),
      "level_4-segment_2": Object.assign({}, this.initial),
      "level_4-segment_3": Object.assign({}, this.initial),
      "level_2-segment_0": Object.assign({}, this.initial),
      "level_2-segment_1": Object.assign({}, this.initial)
    };
    this.segmentColors = {
      "level_6-segment_0": Color.hsv(26, 100, 100).mix(
        Color.hsv(22, 82, 100),
        0.1
      ),
      "level_6-segment_1": Color.hsv(27, 100, 100).mix(
        Color.hsv(32, 100, 100),
        0.1
      ),
      "level_6-segment_2": Color.hsv(28, 100, 100).mix(
        Color.hsv(33, 100, 100),
        0.1
      ),
      "level_6-segment_3": Color.hsv(29, 100, 100).mix(
        Color.hsv(34, 100, 100),
        0.1
      ),
      "level_6-segment_4": Color.hsv(30, 100, 100).mix(
        Color.hsv(35, 100, 100),
        0.1
      ),
      "level_6-segment_5": Color.hsv(31, 100, 100).mix(
        Color.hsv(36, 100, 100),
        0.1
      ),
      "level_4-segment_0": Color.hsv(32, 100, 100).mix(
        Color.hsv(37, 100, 100),
        0.1
      ),
      "level_4-segment_1": Color.hsv(33, 100, 100).mix(
        Color.hsv(38, 100, 100),
        0.1
      ),
      "level_4-segment_2": Color.hsv(34, 100, 100).mix(
        Color.hsv(39, 100, 100),
        0.1
      ),
      "level_4-segment_3": Color.hsv(35, 100, 100).mix(
        Color.hsv(40, 100, 100),
        0.1
      ),
      "level_2-segment_0": Color.hsv(36, 100, 100).mix(
        Color.hsv(41, 100, 100),
        0.1
      ),
      "level_2-segment_1": Color.hsv(37, 100, 100).mix(
        Color.hsv(42, 100, 100),
        0.1
      )
    };

    this.segmentTweens = {
      "level_6-segment_0": this.createSegmentTween(
        "level_6-segment_0",
        SLOW_FLASH_DUR,
        SLOW_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.In
      ),
      "level_6-segment_1": this.createSegmentTween(
        "level_6-segment_1",
        SLOW_FLASH_DUR,
        SLOW_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      "level_6-segment_2": this.createSegmentTween(
        "level_6-segment_2",
        SLOW_FLASH_DUR,
        SLOW_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.Out
      ),
      "level_6-segment_3": this.createSegmentTween(
        "level_6-segment_3",
        SLOW_FLASH_DUR,
        SLOW_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.In
      ),
      "level_6-segment_4": this.createSegmentTween(
        "level_6-segment_4",
        SLOW_FLASH_DUR,
        SLOW_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      "level_6-segment_5": this.createSegmentTween(
        "level_6-segment_5",
        SLOW_FLASH_DUR,
        SLOW_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.Out
      ),
      "level_4-segment_0": this.createSegmentTween(
        "level_4-segment_0",
        SLOW_FLASH_DUR,
        SLOW_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.In
      ),
      "level_4-segment_1": this.createSegmentTween(
        "level_4-segment_1",
        SLOW_FLASH_DUR,
        SLOW_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      "level_4-segment_2": this.createSegmentTween(
        "level_4-segment_2",
        SLOW_FLASH_DUR,
        SLOW_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.Out
      ),
      "level_4-segment_3": this.createSegmentTween(
        "level_4-segment_3",
        SLOW_FLASH_DUR,
        SLOW_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.In
      ),
      "level_2-segment_0": this.createSegmentTween(
        "level_2-segment_0",
        SLOW_FLASH_DUR,
        SLOW_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      "level_2-segment_1": this.createSegmentTween(
        "level_2-segment_1",
        SLOW_FLASH_DUR,
        SLOW_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.Out
      )
    };

    const { pyramidPixels, tweenGroup } = this.params;
    this.pyramidTweens = pyramidPixels.map(p => {
      const color = Color.hsv(30 + (Math.random() < 0.5 ? -1.0 : 1.0) * 5, 100, 100);

      return new TWEEN.Tween({
        ...this.initial
      }, tweenGroup)
        .to(
          {
            brightness: 100
          },
          SLOW_FLASH_DUR
        )
        .delay(SLOW_FLASH_DEL)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .repeat(Infinity)
        .onUpdate(props => {
          setPixelsColors(p, color.value(props.brightness));
        });
    });

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
  buildPlayingAdvice() {
    // colors change suddenly
    [
      "level_6-segment_0",
      "level_6-segment_1",
      "level_6-segment_2",
      "level_6-segment_3",
      "level_6-segment_4",
      "level_6-segment_5",
      "level_4-segment_0",
      "level_4-segment_1",
      "level_4-segment_2",
      "level_4-segment_3",
      "level_2-segment_0",
      "level_2-segment_1"
    ].forEach(segmentId => {
      const color = this.segmentColors[segmentId];
      this.segmentColors[segmentId] = color.hue(
        color.hue() + Math.random() * 10
      );
    });

    this.segmentTweens = {
      "level_6-segment_0": this.createSegmentTween(
        "level_6-segment_0",
        FAST_FLASH_DUR,
        FAST_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.In
      ),
      "level_6-segment_1": this.createSegmentTween(
        "level_6-segment_1",
        FAST_FLASH_DUR,
        FAST_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      "level_6-segment_2": this.createSegmentTween(
        "level_6-segment_2",
        FAST_FLASH_DUR,
        FAST_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.Out
      ),
      "level_6-segment_3": this.createSegmentTween(
        "level_6-segment_3",
        FAST_FLASH_DUR,
        FAST_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.In
      ),
      "level_6-segment_4": this.createSegmentTween(
        "level_6-segment_4",
        FAST_FLASH_DUR,
        FAST_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      "level_6-segment_5": this.createSegmentTween(
        "level_6-segment_5",
        FAST_FLASH_DUR,
        FAST_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.Out
      ),
      "level_4-segment_0": this.createSegmentTween(
        "level_4-segment_0",
        FAST_FLASH_DUR,
        FAST_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.In
      ),
      "level_4-segment_1": this.createSegmentTween(
        "level_4-segment_1",
        FAST_FLASH_DUR,
        FAST_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      "level_4-segment_2": this.createSegmentTween(
        "level_4-segment_2",
        FAST_FLASH_DUR,
        FAST_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.Out
      ),
      "level_4-segment_3": this.createSegmentTween(
        "level_4-segment_3",
        FAST_FLASH_DUR,
        FAST_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.In
      ),
      "level_2-segment_0": this.createSegmentTween(
        "level_2-segment_0",
        FAST_FLASH_DUR,
        FAST_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.InOut
      ),
      "level_2-segment_1": this.createSegmentTween(
        "level_2-segment_1",
        FAST_FLASH_DUR,
        FAST_FLASH_DEL,
        TWEEN.Easing.Sinusoidal.Out
      )
    };
    const { pyramidPixels, tweenGroup } = this.params;
    this.pyramidTweens = pyramidPixels.map(p => {
      const color = Color.hsv(30 + (Math.random() < 0.5 ? -1.0 : 1.0) * 5, 100, 100);

      return new TWEEN.Tween({
        ...this.initial
      }, tweenGroup)
        .to(
          {
            brightness: 100
          },
          FAST_FLASH_DUR
        )
        .delay(FAST_FLASH_DEL)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .repeat(Infinity)
        .onUpdate(props => {
          setPixelsColors(p, color.value(props.brightness));
        });
    });
  }
  start() {
    this.build();
    Object.keys(this.segmentTweens).forEach(segmentId => {
      this.segmentTweens[segmentId].start();
    });
    this.pyramidTweens.forEach(t => t.start());
  }
  startAdvice() {
    this.stop();
    this.buildPlayingAdvice();
    this.start();
  }
  stop() {
    Object.keys(this.segmentTweens).forEach(segmentId => {
      this.segmentTweens[segmentId].stop();
    });
    this.pyramidTweens.forEach(t => t.stop());
  }
  handle_state_change() {
    const state = this.store.getState();

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

export default SpinnyPluckRevealAnimation;
