/**
 *  @file       LightingController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { performance } from 'perf_hooks';
import logger from './logging';
import ControllerWithStore from './ControllerWithStore';
import FadecandyController from './FadecandyController';
import SegmentLightingController from './SegmentLightingController';
import SpinnyPluckIdleAnimation from "./SpinnyPluckIdleAnimation";
import SpinnyPluckTrans4Animation from './SpinnyPluckTrans4Animation';
import SpinnyPluckTrans2Animation from './SpinnyPluckTrans2Animation';
import SpinnyPluckRevealAnimation from './SpinnyPluckRevealAnimation';
import LevelReadyAnimation from './LevelReadyAnimation';
import EminatorIdleAnimation from './EminatorIdleAnimation';
import EminatorTrans4Animation from './EminatorTrans4Animation';
import {
  SEGMENTID_TO_PIXEL_RANGE,
  LEVELID_TO_PIXEL_RANGE,
  NUM_PIXELS,
  SHELL_PYRAMID_PIXEL_RANGES
  //SESSION_PHASES
} from 'owa/constants';
import {
  getLevel2Ready,
  getLevel4Ready
} from './selectors';
import TWEEN from '@tweenjs/tween.js';

import createOPCStrand from "opc/strand"
import { getEnvAsNumber } from './utils';

const DISABLE_LIGHTING = getEnvAsNumber('DISABLE_LIGHTING');
const DEBUG_LIGHTING_PERFORMANCE = getEnvAsNumber('DEBUG_LIGHTING_PERFORMANCE');

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
    const pyramidPixels = SHELL_PYRAMID_PIXEL_RANGES.map(pixelRange => this.pixels.slice.apply(this.pixels, pixelRange));

    // all subcontrollers to tick
    this.controllersToTick = [];

    // subcontrollers for each segment
    this.segmentLightingControllers = [];

    // for each segment get range of pixels for the ring
    segmentIds.forEach((segmentId) => {
      const pixels = this.pixels.slice.apply(
        this.pixels,
        SEGMENTID_TO_PIXEL_RANGE[segmentId]
      );
      segmentPixels[segmentId] = pixels;
      const controller = new SegmentLightingController(this.store, {
        segmentId,
        pixels,
        pyramidPixels
      });
      this.segmentLightingControllers.push(controller);
      this.controllersToTick.push(controller);
    });

    // for each level get range of pixels for the rings
    levelIds.forEach((levelId) => {
      const pixels = this.pixels.slice.apply(
        this.pixels,
        LEVELID_TO_PIXEL_RANGE[levelId]
      );
      levelPixels[levelId] = pixels;
    });

    const params = {
      pixels: this.pixels,
      levelPixels,
      segmentPixels,
      pyramidPixels
    };

    this.idleAnimation = new SpinnyPluckIdleAnimation(this.store, params);
    //this.idleAnimation = new EminatorIdleAnimation(this.store, params);
    //this.trans4Animation = new EminatorTrans4Animation(this.store, params);
    this.trans4Animation = new SpinnyPluckTrans4Animation(this.store, params);
    this.trans2Animation = new SpinnyPluckTrans2Animation(this.store, params);
    this.revealAnimation = new SpinnyPluckRevealAnimation(this.store, params);
    this.level4ReadyAnimation = new LevelReadyAnimation(this.store, {
      ...params,
      ...{
        levelId: 'level_4',
        delayBeats: 8,
        levelReadySelector: getLevel4Ready
      }
    });
    this.level2ReadyAnimation = new LevelReadyAnimation(this.store, {
      ...params,
      ...{
        levelId: 'level_2',
        delayBeats: 16,
        levelReadySelector: getLevel2Ready
      }
    });

    // create FadecandyController (and initiate connection)
    this.fcController = new FadecandyController(this.store);

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

  tick () {
    TWEEN.update();
    this.fcController.writePixels(this.pixels);
    setImmediate(this.render);
  }

  tickDebug () {
    const start = performance.now();
    TWEEN.update();
    this.fcController.writePixels(this.pixels);
    const end = performance.now();
    this.tickCompletionTimeSum += end - start;
    this.numTickMeasurements += 1;
    this.tickCompletionTimeAvg = this.tickCompletionTimeSum / this.numTickMeasurements;
    setImmediate(this.render);
  }

  quit () {
    this.fcController.quit();
    this.hasQuit = true;
  }
}

export default LightingController;
