/**
 *  @file       LightingController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { performance } from "perf_hooks";

import { createSelector } from "reselect";

import logger from "./logging";

import ControllerWithStore from "./ControllerWithStore";
import FadecandyController from "./FadecandyController";
import SegmentLightingController from "./SegmentLightingController";
import SpinnyPluckIdleAnimation from "./SpinnyPluckIdleAnimation";
import SpinnyPluckTrans4Animation from "./SpinnyPluckTrans4Animation";
import SpinnyPluckTrans2Animation from "./SpinnyPluckTrans2Animation";
import SpinnyPluckRevealAnimation from "./SpinnyPluckRevealAnimation";
import LevelReadyAnimation from "./LevelReadyAnimation";
import EminatorIdleAnimation from "./EminatorIdleAnimation";
import EminatorTrans4Animation from './EminatorTrans4Animation';
import EminatorTrans2Animation from './EminatorTrans2Animation';
import EminatorRevealAnimation from './EminatorRevealAnimation';
import {
  SEGMENTID_TO_PIXEL_RANGE,
  LEVELID_TO_PIXEL_RANGE,
  NUM_PIXELS,
  SHELL_PYRAMID_PIXEL_RANGES,
  SONG_IDS
  //SESSION_PHASES
} from "owa/constants";
import { getLevel2Ready, getLevel4Ready, getSongId } from "./selectors";
import TWEEN from "@tweenjs/tween.js";

import createOPCStrand from "opc/strand";
import { getEnvAsNumber } from "./utils";

const DISABLE_LIGHTING = getEnvAsNumber("DISABLE_LIGHTING");
const DEBUG_LIGHTING_PERFORMANCE = getEnvAsNumber("DEBUG_LIGHTING_PERFORMANCE");

const NUM_TWEEN_GROUPS = 2;

const getState = createSelector(
  getSongId,
  songId => ({
    songId
  })
);

/**
 *  @class        LightingController
 *
 *  @classdesc    Top-level controller for all things lighting.  Intiailizes
 *  pixel buffers, sets up Fadecandy connection, etc.
 **/
class LightingController extends ControllerWithStore {
  init() {
    const state = this.store.getState();

    const segmentIds = state.segments.allIds;
    const levelIds = state.levels.allIds;

    this.hasQuit = false;

    // create our pixel buffer
    this.pixels = createOPCStrand(NUM_PIXELS);

    // ranges of pixel buffer for each segment by segmentId
    const segmentPixels = {};

    // ranges of pixel buffer for each level by levelId
    const levelPixels = {};

    // ranges of pixel buffer for each pyramid
    const pyramidPixels = SHELL_PYRAMID_PIXEL_RANGES.map(pixelRange =>
      this.pixels.slice.apply(this.pixels, pixelRange)
    );

    const tweenGroups = [];
    for (let i = 0; i < NUM_TWEEN_GROUPS; i++) {
      tweenGroups.push(new TWEEN.Group());
    }
    this.tweenGroups = tweenGroups;

    // all subcontrollers to tick
    this.controllersToTick = [];

    // subcontrollers for each segment
    this.segmentLightingControllers = [];

    // for each segment get range of pixels for the ring
    segmentIds.forEach(segmentId => {
      const pixels = this.pixels.slice.apply(
        this.pixels,
        SEGMENTID_TO_PIXEL_RANGE[segmentId]
      );
      segmentPixels[segmentId] = pixels;
      const controller = new SegmentLightingController(this.store, {
        segmentId,
        pixels,
        pyramidPixels,
        tweenGroup: tweenGroups[1]
      });
      this.segmentLightingControllers.push(controller);
      this.controllersToTick.push(controller);
    });

    // for each level get range of pixels for the rings
    levelIds.forEach(levelId => {
      const pixels = this.pixels.slice.apply(
        this.pixels,
        LEVELID_TO_PIXEL_RANGE[levelId]
      );
      levelPixels[levelId] = pixels;
    });

    this.lastState = null;

    const animationParams = {
      pixels: this.pixels,
      levelPixels,
      segmentPixels,
      pyramidPixels,
      tweenGroup: tweenGroups[0]
    };

    this.animationParams = animationParams;

    this.level4ReadyAnimation = new LevelReadyAnimation(this.store, {
      ...animationParams,
      ...{
        levelId: "level_4",
        delayBeats: 8,
        levelReadySelector: getLevel4Ready
      }
    });
    this.level2ReadyAnimation = new LevelReadyAnimation(this.store, {
      ...animationParams,
      ...{
        levelId: "level_2",
        delayBeats: 16,
        levelReadySelector: getLevel2Ready
      }
    });

    this.handle_state_change();

    // create FadecandyController (and initiate connection)
    this.fcController = new FadecandyController(this.store);

    let i;
    this.update = () => {
      for (i = 0; i < tweenGroups.length; i++) {
        tweenGroups[i].update();
      }
    };

    this.renderNextFrame = () => setTimeout(this.render, 42);
    //this.renderNextFrame = () => setImmediate(this.render);

    // start render loop
    if (!DISABLE_LIGHTING) {
      if (DEBUG_LIGHTING_PERFORMANCE) {
        this.numTickMeasurements = 0;
        this.tickCompletionTimeAvg = 0;
        this.tickCompletionTimeSum = 0;

        this.render = () => this.tickDebug();

        setInterval(() => {
          logger.debug(
            `LightingController: tickCompletionTimeAvg = ${this.tickCompletionTimeAvg}`
          );
        }, 5000);
      } else {
        this.render = () => this.tick();
      }
      this.render();
    }
  }

  handleSongChanged(songId) {
    const animationParams = { ...this.animationParams, songId };
    switch (songId) {
      case SONG_IDS.SPINNY_PLUCK:
        this.idleAnimation = new SpinnyPluckIdleAnimation(
          this.store,
          animationParams
        );
        this.trans4Animation = new SpinnyPluckTrans4Animation(
          this.store,
          animationParams
        );
        this.trans2Animation = new SpinnyPluckTrans2Animation(
          this.store,
          animationParams
        );
        this.revealAnimation = new SpinnyPluckRevealAnimation(
          this.store,
          animationParams
        );

        break;

      case SONG_IDS.EMINATOR:
        this.idleAnimation = new EminatorIdleAnimation(
          this.store,
          animationParams
        );
        this.trans4Animation = new EminatorTrans4Animation(
          this.store,
          animationParams
        );
        this.trans2Animation = new EminatorTrans2Animation(
          this.store,
          animationParams
        );
        this.revealAnimation = new EminatorRevealAnimation(
          this.store,
          animationParams
        );
        break;

      default:
        break;
    }
  }

  handle_state_change() {
    const state = getState(this.store.getState());

    if (state !== this.lastState) {
      this.handleSongChanged(getSongId(state));
      this.lastState = state;
    }
  }

  tick() {
    this.update();
    this.fcController.writePixels(this.pixels);
    this.renderNextFrame();
  }

  tickDebug() {
    const start = performance.now();
    this.update();
    this.fcController.writePixels(this.pixels);
    const end = performance.now();
    this.tickCompletionTimeSum += end - start;
    this.numTickMeasurements += 1;
    this.tickCompletionTimeAvg =
      this.tickCompletionTimeSum / this.numTickMeasurements;
    this.renderNextFrame();
  }

  quit() {
    this.fcController.quit();
    this.hasQuit = true;
  }
}

export default LightingController;
