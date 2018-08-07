/**
 *  @file       LightingController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import ControllerWithStore from './ControllerWithStore';
import FadecandyController from './FadecandyController';
import SegmentLightingController from './SegmentLightingController';
import IdleModeAnimation from "./SpinnyPluck_EerieIdleModeAnimation.js";
import Trans6Animation from "./SpinnyPluckIdle-L6TransitionAnimation";

import {
  SEGMENTID_TO_PIXEL_RANGE,
  LEVELID_TO_PIXEL_RANGE,
  SESSION_PHASES
} from './constants';
import TWEEN from '@tweenjs/tween.js';

import createOPCStrand from "opc/strand"
import { getEnvAsNumber } from './utils';

const DISABLE_LIGHTING = getEnvAsNumber('DISABLE_LIGHTING');

/**
 *  @class        LightingController
 *
 *  @classdesc    Top-level controller for all things lighting.  Intiailizes
 *  pixel buffers, sets up Fadecandy connection, etc.
 **/
class LightingController extends ControllerWithStore {
  init() {
    let state = this.store.getState();

    let segmentIds = state.segments.allIds;
    let levelIds = state.levels.allIds;

    // create our pixel buffer
    this.pixels = createOPCStrand(144);

    // ranges of pixel buffer for each segment
    this.segmentPixels = {};

    // ranges of pixel buffer for each level
    this.levelPixels = {};

    // all subcontrollers to tick
    this.controllersToTick = [];

    // subcontrollers for each segment
    this.segmentLightingControllers = [];

    // for each segment get range of pixels for the ring
    segmentIds.forEach((segmentId) => {
      let pixels = this.pixels.slice.apply(
        this.pixels,
        SEGMENTID_TO_PIXEL_RANGE[segmentId]
      );
      this.segmentPixels[segmentId] = pixels;
      let controller = new SegmentLightingController(this.store, {
        segmentId,
        pixels
      });
      this.segmentLightingControllers.push(controller);
      this.controllersToTick.push(controller);
    });

    // for each level get range of pixels for the rings
    levelIds.forEach((levelId) => {
      let pixels = this.pixels.slice.apply(
        this.pixels,
        LEVELID_TO_PIXEL_RANGE[levelId]
      );
      this.levelPixels[levelId] = pixels;
    });

    let params = {
      pixels: this.pixels,
      levelPixels: this.levelPixels,
      segmentPixels: this.segmentPixels
    };

    this.idleModeAnimation = new IdleModeAnimation(this.store, params);

    // create FadecandyController (and initiate connection)
    this.fcController = new FadecandyController(this.store);

    // start render loop
    if (!DISABLE_LIGHTING) {
      setInterval(this.tick.bind(this), 50);
    }


  }


  tick () {
    TWEEN.update();
    this.controllersToTick.forEach(function(controller) {
      controller.tick();
    });
    this.fcController.writePixels(this.pixels);
  }

  quit () {
  }
}

export default LightingController;
