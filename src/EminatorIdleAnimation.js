/**
 *  @file       EminatorIdleAnimation.js
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

class EminatorIdleAnimation extends IdleAnimation {
  build() {
    const { tweenGroup } = this.params;
    this.stop();
    this.animationState = {
      masterBrightness: 1.0,
      transHueOffset: 0.0
    };

    const initial = {
      brightness: 0.02
    };
    const dest = {
      brightness: 0.67
    };

    const initialBrightness = 67;

    this.segmentColors = {
      "level_6-segment_0": Color.hsv(241, 94, initialBrightness).mix(
        Color.hsv(120, 94, 40),
        0.2
      ),
      "level_6-segment_1": Color.hsv(218, 96, initialBrightness).mix(
        Color.hsv(128, 94, 40),
        0.2
      ),
      "level_6-segment_2": Color.hsv(243, 70, initialBrightness).mix(
        Color.hsv(136, 94, 40),
        0.2
      ),
      "level_6-segment_3": Color.hsv(203, 84, initialBrightness).mix(
        Color.hsv(144, 94, 40),
        0.2
      ),
      "level_6-segment_4": Color.hsv(184, 93, initialBrightness).mix(
        Color.hsv(152, 94, 40),
        0.2
      ),
      "level_6-segment_5": Color.hsv(169, 96, initialBrightness).mix(
        Color.hsv(160, 94, 40),
        0.2
      ),
      "level_4-segment_0": Color.hsv(188, 84, initialBrightness).mix(
        Color.hsv(168, 94, 40),
        0.2
      ),
      "level_4-segment_1": Color.hsv(171, 66, initialBrightness).mix(
        Color.hsv(176, 94, 40),
        0.2
      ),
      "level_4-segment_2": Color.hsv(172, 72, initialBrightness).mix(
        Color.hsv(184, 94, 40),
        0.2
      ),
      "level_4-segment_3": Color.hsv(168, 94, initialBrightness).mix(
        Color.hsv(192, 94, 40),
        0.2
      ),
      "level_2-segment_0": Color.hsv(203, 88, initialBrightness).mix(
        Color.hsv(200, 94, 40),
        0.2
      ),
      "level_2-segment_1": Color.hsv(215, 77, initialBrightness).mix(
        Color.hsv(208, 94, 40),
        0.2
      )
    };

    //INPUT RED SNAKE ANIMATION FOR ALIEN SOUND - 2 layer LED animation

    const createSegmentTween = (segmentId, levelId) => {
      const segmentPixels = this.params.segmentPixels;
      const segmentColors = this.segmentColors;
      let transHueOffset = 0;

      // only level6 turns green during trans
      if (levelId === "level_6") {
        transHueOffset = this.animationState.transHueOffset;
      }

      return (
        new TWEEN.Tween({...initial}, tweenGroup)
          .to({...dest}, 3000)
          .delay(Math.random() * 2000)
          //.delay(Math.random() * 500)
          //+ 1000)
          //.to(Object.assign({}, dest), 8000)
          //.delay(Math.random() * 500 + 2000)
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
          })
      );
    };

    this.segmentTweens = {
      "level_6-segment_0": createSegmentTween(
        "level_6-segment_0",
        "level_6"
      ).easing(TWEEN.Easing.Bounce.InOut),
      "level_6-segment_1": createSegmentTween(
        "level_6-segment_1",
        "level_6"
      ).easing(TWEEN.Easing.Bounce.InOut),
      "level_6-segment_2": createSegmentTween(
        "level_6-segment_2",
        "level_6"
      ).easing(TWEEN.Easing.Bounce.InOut),
      "level_6-segment_3": createSegmentTween(
        "level_6-segment_3",
        "level_6"
      ).easing(TWEEN.Easing.Bounce.InOut),
      "level_6-segment_4": createSegmentTween(
        "level_6-segment_4",
        "level_6"
      ).easing(TWEEN.Easing.Bounce.InOut),
      "level_6-segment_5": createSegmentTween(
        "level_6-segment_5",
        "level_6"
      ).easing(TWEEN.Easing.Bounce.InOut),
      "level_4-segment_0": createSegmentTween(
        "level_4-segment_0",
        "level_4"
      ).easing(TWEEN.Easing.Bounce.InOut),
      "level_4-segment_1": createSegmentTween(
        "level_4-segment_1",
        "level_4"
      ).easing(TWEEN.Easing.Bounce.InOut),
      "level_4-segment_2": createSegmentTween(
        "level_4-segment_2",
        "level_4"
      ).easing(TWEEN.Easing.Bounce.InOut),
      "level_4-segment_3": createSegmentTween(
        "level_4-segment_3",
        "level_4"
      ).easing(TWEEN.Easing.Bounce.InOut),
      "level_2-segment_0": createSegmentTween(
        "level_2-segment_0",
        "level_2"
      ).easing(TWEEN.Easing.Bounce.InOut),
      "level_2-segment_1": createSegmentTween(
        "level_2-segment_1",
        "level_2"
      ).easing(TWEEN.Easing.Bounce.InOut)
    };
    
    const { pyramidPixels } = this.params;

    this.pyramidTweens = pyramidPixels.map(p => {
      const color = Color.hsv(
        240 + (Math.random() < 0.5 ? -1.0 : 1.0) * 10,
        120,
        initialBrightness
      );

      return new TWEEN.Tween({ ...initial }, tweenGroup)
        .to({ ...dest }, 3000)
        .easing(TWEEN.Easing.Bounce.InOut)
        .delay(Math.random() * 2000)
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

    this.transBrightnessTween = new TWEEN.Tween(
      { masterBrightness: 1.0 },
      tweenGroup
    )
      .to(
        {
          masterBrightness: 0.1
        },
        transDur
      )
      .easing(TWEEN.Easing.Cubic.In)
      .onUpdate(props => {
        this.animationState.masterBrightness = props.masterBrightness;
      });

    this.transHueTween = new TWEEN.Tween({ transHueOffset: 0.5 }, tweenGroup)
      .to(
        {
          transHueOffset: 70.0
        },
        500
      )
      .easing(TWEEN.Easing.Sinusoidal.In)
      .onUpdate(props => {
        this.animationState.transHueOffset = props.transHueOffset;
      });

    this.firstSegmentColor = Color.hsv(135, 97, 100);

    this.firstSegmentPulsingTween = new TWEEN.Tween(
      { brightness: 0.8 },
      tweenGroup
    )
      .to({ brightness: 0.9 }, 1000)
      .easing(TWEEN.Easing.Bounce.InOut)
      .yoyo(true)
      .repeat(Infinity)
      .onUpdate(props => {
        this.animationState.firstSegmentBrightness = props.brightness;
      });

    let i;
    this.firstSegmentCountdownTween = new TWEEN.Tween(
      { remaining: 1.0 },
      tweenGroup
    )
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
    if (this.segmentTweens) {
      Object.keys(this.segmentTweens).forEach(segmentId => {
        this.segmentTweens[segmentId].stop();
      });
    }
    this.transBrightnessTween && this.transBrightnessTween.stop();
    this.transHueTween && this.transHueTween.stop();
    this.firstSegmentPulsingTween && this.firstSegmentPulsingTween.stop();
    this.firstSegmentCountdownTween && this.firstSegmentCountdownTween.stop();
    this.pyramidTweens && this.pyramidTweens.forEach(t => t.stop());
  }
}

export default EminatorIdleAnimation;
