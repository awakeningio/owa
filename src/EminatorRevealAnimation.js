import TWEEN from "@tweenjs/tween.js";
import Color from "color";

import { setPixelsColors } from "./Pixels";
import RevealAnimation from "./RevealAnimation";

import {
  SONG_IDS,
  TEMPO_BY_SONGID,
  SESSION_PHASES,
  SESSION_PHASE_DURATIONS_BY_SONGID
} from "owa/constants";

import { beatsToMs, choose } from "./utils";

const songId = SONG_IDS.EMINATOR;
const tempo = TEMPO_BY_SONGID[songId];

class EminatorRevealAnimation extends RevealAnimation {
  build() {
    const { tweenGroup } = this.params;
    const initial = {
      brightness: 0
    };
    const dest = {
      brightness: 100
    };

    const beats =
      SESSION_PHASE_DURATIONS_BY_SONGID[songId][SESSION_PHASES.TRANS_ADVICE];
    const dur = beatsToMs(beats, tempo);

    this.segmentColors = {
      "level_6-segment_0": Color.hsv(233, 60, 100).mix(
        Color.hsv(22, 82, 100),
        0.1
      ),
      "level_6-segment_1": Color.hsv(233, 60, 100).mix(
        Color.hsv(32, 100, 100),
        0.1
      ),
      "level_6-segment_2": Color.hsv(233, 60, 100).mix(
        Color.hsv(33, 100, 100),
        0.1
      ),
      "level_6-segment_3": Color.hsv(233, 60, 100).mix(
        Color.hsv(34, 100, 100),
        0.1
      ),
      "level_6-segment_4": Color.hsv(233, 60, 100).mix(
        Color.hsv(35, 100, 100),
        0.1
      ),
      "level_6-segment_5": Color.hsv(233, 60, 100).mix(
        Color.hsv(36, 100, 100),
        0.1
      ),
      "level_4-segment_0": Color.hsv(233, 60, 100).mix(
        Color.hsv(37, 100, 100),
        0.1
      ),
      "level_4-segment_1": Color.hsv(233, 60, 100).mix(
        Color.hsv(38, 100, 100),
        0.1
      ),
      "level_4-segment_2": Color.hsv(233, 60, 100).mix(
        Color.hsv(39, 100, 100),
        0.1
      ),
      "level_4-segment_3": Color.hsv(233, 60, 100).mix(
        Color.hsv(40, 100, 100),
        0.1
      ),
      "level_2-segment_0": Color.hsv(233, 60, 100).mix(
        Color.hsv(41, 100, 100),
        0.1
      ),
      "level_2-segment_1": Color.hsv(233, 60, 100).mix(
        Color.hsv(42, 100, 100),
        0.1
      )
    };

    const gestureDur = dur;

    const shellDur = 0.4 * gestureDur;
    const segmentDur = 0.5 * gestureDur;

    const { segmentPixels, pyramidPixels } = this.params;

    this.allTweens = [];

    const createSegmentTween = segmentId => {
      const segmentPixels = this.params.segmentPixels;
      const segmentColors = this.segmentColors;
      const segmentAnimationState = { ...initial };

      const updateSegment = props => {
        setPixelsColors(
          segmentPixels[segmentId],
          segmentColors[segmentId].value(props.brightness)
        );
      };

      const pauseTween = new TWEEN.Tween(segmentAnimationState, tweenGroup).to(
        segmentAnimationState,
        shellDur
      );

      const inTween = new TWEEN.Tween(segmentAnimationState, tweenGroup)
        .to({ ...dest }, segmentDur)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate(updateSegment);

      //const outTween = new TWEEN.Tween(segmentAnimationState, tweenGroup)
      //.to({...initial}, 0.5 * segmentDur)
      //.easing(TWEEN.Easing.Sinusoidal.In)
      //.onUpdate(updateSegment);

      //const outPauseTween = new TWEEN.Tween(segmentAnimationState, tweenGroup)
      //.to(segmentAnimationState, 0.5 * shellDur);

      pauseTween.chain(inTween);
      //inTween.chain(outTween);
      //outTween.chain(outPauseTween);
      this.allTweens.push(pauseTween);
      this.allTweens.push(inTween);
      //this.allTweens.push(outTween);
      //this.allTweens.push(outPauseTween);

      return pauseTween;
    };

    const createPyramidTween = (p, i) => {
      const color = Color.hsv(
        230 + (Math.random() < 0.5 ? -1.0 : 1.0) * 15,
        120,
        100
      );

      const pyramidAnimationState = { ...initial };
      const inFrame = new TWEEN.Tween(pyramidAnimationState, tweenGroup)
        .to({ ...dest }, shellDur)
        .delay(i * 100)
        .easing(TWEEN.Easing.Sinusoidal.In)
        //.repeat(Math.floor(dur / gestureDur))
        .onUpdate(props => {
          setPixelsColors(p, color.value(props.brightness));
        });

      const stillFrame = new TWEEN.Tween(pyramidAnimationState, tweenGroup).to(
        pyramidAnimationState,
        segmentDur
      );

      //const outFrame = new TWEEN.Tween(pyramidAnimationState, tweenGroup)
      //.to({...initial}, 0.5 * shellDur)
      //.easing(TWEEN.Easing.Sinusoidal.In)
      //.onUpdate(props => {
      //setPixelsColors(p, color.value(props.brightness));
      //});

      inFrame.chain(stillFrame);
      //stillFrame.chain(outFrame);

      this.allTweens.push(inFrame);
      this.allTweens.push(stillFrame);
      //this.allTweens.push(outFrame);

      return inFrame;
    };

    this.segmentTweens = Object.keys(segmentPixels).reduce(
      (segmentTweens, segmentId) => {
        segmentTweens[segmentId] = createSegmentTween(segmentId);
        return segmentTweens;
      },
      {}
    );

    this.pyramidTweens = pyramidPixels.map(createPyramidTween);
  }
  buildAdvice() {
    const { pyramidPixels, tweenGroup, segmentPixels } = this.params;
    const initial = {
      brightness: 0
    };
    const createSegmentTween = segmentId => {
      const pixels = segmentPixels[segmentId];
      const color = this.segmentColors[segmentId];
      const easing = TWEEN.Easing.Sinusoidal.In;
      const t = new TWEEN.Tween({ ...initial }, tweenGroup)
        .to(
          {
            brightness: 100
          },
          choose([
            beatsToMs(2, tempo),
            beatsToMs(4, tempo),
            beatsToMs(8, tempo)
          ])
        )
        .easing(easing)
        .yoyo(true)
        .repeat(Infinity)
        .onUpdate(props => {
          setPixelsColors(pixels, color.value(props.brightness));
        });
      this.allTweens.push(t);
      return t;
    };
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
        230 + (Math.random() < 0.5 ? -1.0 : 1.0) * 15
      );
    });

    this.segmentTweens = Object.keys(segmentPixels).reduce(
      (segmentTweens, segmentId) => {
        segmentTweens[segmentId] = createSegmentTween(segmentId);
        return segmentTweens;
      },
      {}
    );
    this.pyramidTweens = pyramidPixels.map(p => {
      const color = Color.hsv(
        230 + (Math.random() < 0.5 ? -1.0 : 1.0) * 15,
        100,
        100
      );

      const t = new TWEEN.Tween(
        {
          ...initial
        },
        tweenGroup
      )
        .to(
          {
            brightness: 100
          },
          choose([
            beatsToMs(2, tempo),
            beatsToMs(4, tempo),
            beatsToMs(8, tempo)
          ])
        )
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .repeat(Infinity)
        .onUpdate(props => {
          setPixelsColors(p, color.value(props.brightness));
        });
      this.allTweens.push(t);
      return t;
    });
  }
  start() {
    console.log("EminatorRevealAnimation.start");
    Object.keys(this.segmentTweens).forEach(segmentId => {
      this.segmentTweens[segmentId].start();
    });
    this.pyramidTweens.forEach(t => t.start());
  }
  startAdvice() {
    this.stop();
    this.buildAdvice();
    this.start();
  }
  stop() {
    console.log("EminatorRevealAnimation.stop");
    // Workaround a TWEEN.js bug when chained tweens wont stop.
    this.allTweens.forEach(t => t.stop());
    this.allTweens = [];
    //Object.keys(this.segmentTweens).forEach(segmentId => {
    //this.segmentTweens[segmentId].stop();
    //this.segmentTweens[segmentId].stopChainedTweens();
    //});
    //this.pyramidTweens.forEach(t => {
    //t.stop();
    //t.stopChainedTweens();
    //});
  }
}

export default EminatorRevealAnimation;
