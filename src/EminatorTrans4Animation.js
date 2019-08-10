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

import TWEEN from "@tweenjs/tween.js";
import Color from "color";

import { setPixelsColors } from "./Pixels";
import Trans4Animation from "./Trans4Animation";

import {
  SESSION_PHASE_BEATS_PER_BAR_BY_SONGID,
  SONG_IDS,
  TEMPO_BY_SONGID,
  SESSION_PHASES
} from "owa/constants";

import { beatsToMs } from './utils';

class EminatorTrans4Animation extends Trans4Animation {
  build() {
    const { tweenGroup } = this.params;
    const initial = {
      brightness: 0
    };
    const dest = {
      brightness: 100
    };

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

    const beatsPerBar = SESSION_PHASE_BEATS_PER_BAR_BY_SONGID[SONG_IDS.EMINATOR][SESSION_PHASES.TRANS_4];

    const gestureDur = beatsToMs(4 * beatsPerBar, TEMPO_BY_SONGID[SONG_IDS.EMINATOR]);

    const shellDur = 0.4 * gestureDur;
    const segmentDur = 0.5 * gestureDur;

    const { segmentPixels, pyramidPixels } = this.params;

    this.allTweens = [];

    const createSegmentTween = segmentId => {
      const segmentPixels = this.params.segmentPixels;
      const segmentColors = this.segmentColors;
      const segmentAnimationState = {...initial};

      const updateSegment = props => {
          setPixelsColors(
            segmentPixels[segmentId],
            segmentColors[segmentId].value(props.brightness)
          );
        };

      const pauseTween = new TWEEN.Tween(segmentAnimationState, tweenGroup)
        .to(segmentAnimationState, 0.5 * shellDur)
      
      const inTween = new TWEEN.Tween(segmentAnimationState, tweenGroup)
        .to({ ...dest }, 0.5 * segmentDur)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate(updateSegment);

      const outTween = new TWEEN.Tween(segmentAnimationState, tweenGroup)
        .to({...initial}, 0.5 * segmentDur)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate(updateSegment);

      const outPauseTween = new TWEEN.Tween(segmentAnimationState, tweenGroup)
        .to(segmentAnimationState, 0.5 * shellDur);

      pauseTween.chain(inTween);
      inTween.chain(outTween);
      outTween.chain(outPauseTween);
      outPauseTween.chain(pauseTween);
      this.allTweens.push(pauseTween);
      this.allTweens.push(inTween);
      this.allTweens.push(outTween);
      this.allTweens.push(outPauseTween);

      return pauseTween;
    };

    const createPyramidTween = (p, i) => {
      const color = Color.hsv(
        230 + (Math.random() < 0.5 ? -1.0 : 1.0) * 15,
        120,
        100
      );

      const pyramidAnimationState = {...initial};
      const inFrame = new TWEEN.Tween(pyramidAnimationState, tweenGroup)
        .to({...dest}, 0.5 * shellDur)
        .delay(i * 100)
        .easing(TWEEN.Easing.Sinusoidal.In)
        //.repeat(Math.floor(dur / gestureDur))
        .onUpdate(props => {
          setPixelsColors(p, color.value(props.brightness));
        });

      const stillFrame = new TWEEN.Tween(pyramidAnimationState, tweenGroup)
        .to(pyramidAnimationState, segmentDur);

      const outFrame = new TWEEN.Tween(pyramidAnimationState, tweenGroup)
        .to({...initial}, 0.5 * shellDur)
        .easing(TWEEN.Easing.Sinusoidal.In)
        .onUpdate(props => {
          setPixelsColors(p, color.value(props.brightness));
        });

      inFrame.chain(stillFrame);
      stillFrame.chain(outFrame);
      outFrame.chain(inFrame);

      this.allTweens.push(inFrame);
      this.allTweens.push(stillFrame);
      this.allTweens.push(outFrame);

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
  start() {
    Object.keys(this.segmentTweens).forEach(segmentId => {
      this.segmentTweens[segmentId].start();
    });
    this.pyramidTweens.forEach(t => t.start());
  }
  stop() {
    console.log("EminatorTrans4Animation.stop");
    // Workaround a TWEEN.js bug when chained tweens wont stop.
    this.allTweens.forEach(t => t.stop());
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

export default EminatorTrans4Animation;
