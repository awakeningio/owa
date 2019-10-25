/**
 *  @file       SegmentVariationMenuAnimation.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2019 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import TWEEN from "@tweenjs/tween.js";
import Color from "color";

import ControllerWithStore from "./ControllerWithStore";
import { getSegmentIdToSequencerId } from "./selectors";
import {
  VARIATION_MENU_TYPES,
  //VARIATION_INTERACTION_STATES
} from "owa/constants";
import { setPixelColors } from "./Pixels";

const MENU_SELECTED_COLOR = Color.rgb(255, 255, 255);
const MENU_CHOSEN_COLOR = Color.rgb(128, 255, 128);
const MENU_OFF_COLOR = Color.rgb(64, 64, 64);

class SegmentVariationMenuAnimation extends ControllerWithStore {
  init() {
    const state = this.store.getState();
    this.sessionPhase = state.sessionPhase;
    this.songId = state.songId;
    this.sequencer = state.sequencers[
      getSegmentIdToSequencerId(state)[this.params.segmentId]
    ];
    this.allTweens = [];
    this.build();
  }

  stopAllTweens() {
    this.allTweens.forEach(t => t.stop());
  }

  startChoosing() {
    this.choosingTween.start();
  }

  startChosen() {
    this.stopAllTweens();
    this.chosenTween.start();
  }

  stop() {
    this.stopAllTweens();
    this.build();
  }

  build () {
    this.choosingTween = this.buildChoosing();
    this.chosenTween = this.buildChosen();
  }

  buildTween({ menuColor, inDur, outDur }) {
    const {
      variationMenuType,
      currentVariationIndex,
      variationProps,
    } = this.sequencer;
    const { pixels } = this.params;

    const numVariations = variationProps.length;

    this.animationState = {
      currentVariationIndex
    };

    let onUpdate = null;

    switch (variationMenuType) {
      case VARIATION_MENU_TYPES.SECTIONS:
        const pixelsPerSection = Math.ceil(pixels.length / numVariations);
        onUpdate = props => {
          const {
            currentVariationIndex
          } = this.animationState;

          let iv, ip;

          // Displays currently chosen variation as a section of the ring
          for (iv = 0; iv < numVariations; iv++) {
            // For each variation, set pixels off unless it is the currently
            // selected variation
            const startPixel = iv * pixelsPerSection;
            const endPixel = (iv + 1) * pixelsPerSection;
            let color;
            if (iv === currentVariationIndex) {
              color = menuColor.value(255 * props.brightnessMul);
            } else {
              color = MENU_OFF_COLOR;
            }
            for (ip = startPixel; ip < endPixel; ip++) {
              setPixelColors(pixels, ip, color);
            }
          }
          
        };
        break;
      
      default:
        break;
    }

    const keyframes = [
      {
        props: {
          brightnessMul: 0.3
        },
        dur: inDur
      },
      {
        props: {
          brightnessMul: 0.7
        },
        dur: outDur
      }
    ];

    if (onUpdate !== null) {
      this.inTween = new TWEEN.Tween(
        {...keyframes[0].props},
        this.params.tweenGroup
      )
        .to(
          {...keyframes[1].props},
          keyframes[0].dur
        )
        .easing(TWEEN.Easing.Circular.In)
        .onUpdate(onUpdate)
        .onComplete(props => {
          props.brightnessMul = keyframes[0].props.brightnessMul;
        });
      this.outTween = new TWEEN.Tween(
        {...keyframes[1].props},
        this.params.tweenGroup
      )
        .to(
          {...keyframes[0].props}, keyframes[1].dur
        )
        .easing(TWEEN.Easing.Circular.Out)
        .onUpdate(onUpdate)
        .onComplete(props => props.brightnessMul = keyframes[1].props.brightnessMul);
      this.inTween.chain(this.outTween);
      this.outTween.chain(this.inTween);

      this.allTweens.push(this.inTween);
      this.allTweens.push(this.outTween);
      return this.inTween;
    } else {
      return null;
    }
  }

  buildChoosing() {
    return this.buildTween({
      menuColor: MENU_SELECTED_COLOR,
      inDur: 1200,
      outDur: 1800
    });
  }

  buildChosen() {
    return this.buildTween({
      menuColor: MENU_CHOSEN_COLOR,
      inDur: 300,
      outDur: 600
    });
  }

  handle_state_change() {
    const state = this.store.getState();
    const sessionPhase = state.sessionPhase;
    const songId = state.songId;
    const sequencer = state.sequencers[
      getSegmentIdToSequencerId(state)[this.params.segmentId]
    ];
    if (songId !== this.songId || sessionPhase !== this.sessionPhase) {
      this.build();
    }
    if (sequencer !== this.sequencer) {
      this.sequencer = sequencer;
      const {
        currentVariationIndex,
        //variationInteractionState
      } = this.sequencer;
      this.animationState.currentVariationIndex = currentVariationIndex;
    }
  }
}

export default SegmentVariationMenuAnimation;
