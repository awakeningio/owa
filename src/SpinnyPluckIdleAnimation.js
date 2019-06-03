/**
 *  @file       SpinnyPluck_EerieIdleModeAnimation.js
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

import { setPixelsColors, setPixelColors } from "./Pixels";
import { SESSION_PHASES } from "owa/constants";
import IdleAnimation from "./IdleAnimation";

class SpinnyPluckIdleAnimation extends IdleAnimation {
  build() {
    const { tweenGroup } = this.params;
    this.animationState = {
      masterBrightness: 1.0,
      transHueOffset: 0.0
    };

    const initial = {
      brightness: 0.02
    };
    const dest = {
      brightness: 1.0
    };

    const initialBrightness = 100;

    this.segmentColors = {
      "level_6-segment_0": Color.hsv(26, 100, initialBrightness).mix(
        Color.hsv(22, 82, 100),
        0.2
      ),
      "level_6-segment_1": Color.hsv(27, 100, initialBrightness).mix(
        Color.hsv(32, 100, 100),
        0.2
      ),
      "level_6-segment_2": Color.hsv(28, 100, initialBrightness).mix(
        Color.hsv(33, 100, 100),
        0.2
      ),
      "level_6-segment_3": Color.hsv(29, 100, initialBrightness).mix(
        Color.hsv(34, 100, 100),
        0.2
      ),
      "level_6-segment_4": Color.hsv(30, 100, initialBrightness).mix(
        Color.hsv(35, 100, 100),
        0.2
      ),
      "level_6-segment_5": Color.hsv(31, 100, initialBrightness).mix(
        Color.hsv(36, 100, 100),
        0.2
      ),
      "level_4-segment_0": Color.hsv(32, 100, initialBrightness).mix(
        Color.hsv(37, 100, 100),
        0.2
      ),
      "level_4-segment_1": Color.hsv(33, 100, initialBrightness).mix(
        Color.hsv(38, 100, 100),
        0.2
      ),
      "level_4-segment_2": Color.hsv(34, 100, initialBrightness).mix(
        Color.hsv(39, 100, 100),
        0.2
      ),
      "level_4-segment_3": Color.hsv(35, 100, initialBrightness).mix(
        Color.hsv(40, 100, 100),
        0.2
      ),
      "level_2-segment_0": Color.hsv(36, 100, initialBrightness).mix(
        Color.hsv(41, 100, 100),
        0.2
      ),
      "level_2-segment_1": Color.hsv(37, 100, initialBrightness).mix(
        Color.hsv(42, 100, 100),
        0.2
      )
    };

    const createSegmentTween = (segmentId, levelId) => {
      const segmentPixels = this.params.segmentPixels;
      const segmentColors = this.segmentColors;
      let transHueOffset = 0;

      // only level6 turns green during trans
      if (levelId === "level_6") {
        transHueOffset = this.animationState.transHueOffset;
      }

      return new TWEEN.Tween({ ...initial }, tweenGroup)
        .to({ ...dest }, 8000)
        .delay(Math.random() * 500 + 2000)
        .yoyo(true)
        .repeat(Infinity)
        .onUpdate(props => {
          setPixelsColors(
            segmentPixels[segmentId],
            segmentColors[segmentId]
              .value(
                100 * props.brightness * this.animationState.masterBrightness
              )
              .hue(segmentColors[segmentId].hue() + transHueOffset)
          );
        });
    };

    this.segmentTweens = {
      "level_6-segment_0": createSegmentTween(
        "level_6-segment_0",
        "level_6"
      ).easing(TWEEN.Easing.Sinusoidal.In),
      "level_6-segment_1": createSegmentTween(
        "level_6-segment_1",
        "level_6"
      ).easing(TWEEN.Easing.Sinusoidal.InOut),
      "level_6-segment_2": createSegmentTween(
        "level_6-segment_2",
        "level_6"
      ).easing(TWEEN.Easing.Sinusoidal.Out),
      "level_6-segment_3": createSegmentTween(
        "level_6-segment_3",
        "level_6"
      ).easing(TWEEN.Easing.Sinusoidal.In),
      "level_6-segment_4": createSegmentTween(
        "level_6-segment_4",
        "level_6"
      ).easing(TWEEN.Easing.Sinusoidal.InOut),
      "level_6-segment_5": createSegmentTween(
        "level_6-segment_5",
        "level_6"
      ).easing(TWEEN.Easing.Sinusoidal.Out),
      "level_4-segment_0": createSegmentTween(
        "level_4-segment_0",
        "level_4"
      ).easing(TWEEN.Easing.Sinusoidal.In),
      "level_4-segment_1": createSegmentTween(
        "level_4-segment_1",
        "level_4"
      ).easing(TWEEN.Easing.Sinusoidal.InOut),
      "level_4-segment_2": createSegmentTween(
        "level_4-segment_2",
        "level_4"
      ).easing(TWEEN.Easing.Sinusoidal.Out),
      "level_4-segment_3": createSegmentTween(
        "level_4-segment_3",
        "level_4"
      ).easing(TWEEN.Easing.Sinusoidal.In),
      "level_2-segment_0": createSegmentTween(
        "level_2-segment_0",
        "level_2"
      ).easing(TWEEN.Easing.Sinusoidal.InOut),
      "level_2-segment_1": createSegmentTween(
        "level_2-segment_1",
        "level_2"
      ).easing(TWEEN.Easing.Sinusoidal.Out)
    };

    const { pyramidPixels } = this.params;

    this.pyramidTweens = pyramidPixels.map(p => {
      const color = Color.hsv(
        25 + (Math.random() < 0.5 ? -1.0 : 1.0) * 4,
        120,
        initialBrightness
      );

      return new TWEEN.Tween({ ...initial }, tweenGroup)
        .to({ ...dest }, 8000)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .delay(Math.random() * 750 + 2000)
        .yoyo(true)
        .repeat(Infinity)
        .onUpdate(props => {
          setPixelsColors(
            p,
            color.value(
              100 * props.brightness * this.animationState.masterBrightness
            )
          );
        });
    });

    const state = this.store.getState();
    const transDur =
      (state.sessionPhaseDurations[SESSION_PHASES.TRANS_6] / state.tempo) *
      60.0 *
      1000.0;

    this.transBrightnessTween = new TWEEN.Tween({ masterBrightness: 1.0 }, tweenGroup)
      .to(
        {
          masterBrightness: 0.0
        },
        transDur
      )
      .easing(TWEEN.Easing.Sinusoidal.In)
      .onUpdate(props => {
        this.animationState.masterBrightness = props.masterBrightness;
      });

    this.transHueTween = new TWEEN.Tween({ transHueOffset: 0.0 }, tweenGroup)
      .to(
        {
          transHueOffset: 30.0
        },
        500
      )
      .easing(TWEEN.Easing.Sinusoidal.In)
      .onUpdate(props => {
        this.animationState.transHueOffset = props.transHueOffset;
      });

    this.firstSegmentColor = Color.hsv(280, 100, 100);

    this.firstSegmentPulsingTween = new TWEEN.Tween({ brightness: 0.8 }, tweenGroup)
      .to({ brightness: 0.9 }, 1500)
      .easing(TWEEN.Easing.Cubic.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate(props => {
        this.animationState.firstSegmentBrightness = props.brightness;
      });

    let i;
    this.firstSegmentCountdownTween = new TWEEN.Tween({ remaining: 1.0 }, tweenGroup)
      .to(
        {
          remaining: 0.0
        },
        transDur
      )
      .onUpdate(props => {
        const lastLit = Math.round(props.remaining * 12);
        for (i = 0; i < lastLit; i++) {
          setPixelColors(
            this.params.segmentPixels[this.state.firstSegmentPressed],
            i,
            this.firstSegmentColor.value(
              255 * this.animationState.firstSegmentBrightness
            )
          );
        }
        for (i = lastLit; i < 12; i++) {
          setPixelColors(
            this.params.segmentPixels[this.state.firstSegmentPressed],
            i,
            this.firstSegmentColor.value(25)
          );
        }
      });
  }

  startIdle() {
    Object.keys(this.segmentTweens).forEach(segmentId => {
      this.segmentTweens[segmentId].start();
    });
    this.pyramidTweens.forEach(t => t.start());
  }
  startQueueTrans6() {
    this.transHueTween.start();
    this.segmentTweens[this.state.firstSegmentPressed].stop();
    this.firstSegmentPulsingTween.start();
    this.firstSegmentCountdownTween.start();
  }
  startTrans6() {
    this.transBrightnessTween.start();
  }
  stop() {
    Object.keys(this.segmentTweens).forEach(segmentId => {
      this.segmentTweens[segmentId].stop();
    });
    this.transBrightnessTween.stop();
    this.transHueTween.stop();
    this.firstSegmentPulsingTween.stop();
    this.firstSegmentCountdownTween.stop();
    this.pyramidTweens.forEach(t => t.stop());
  }
}

export default SpinnyPluckIdleAnimation;
