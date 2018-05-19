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
import { SEGMENTID_TO_PIXEL_RANGE } from './constants';
import TWEEN from '@tweenjs/tween.js';

import createOPCStrand from "opc/strand"

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
    // create our pixel buffer
    this.pixels = createOPCStrand(144);

    // ranges of pixel buffer for each segment
    //this.segmentPixels = {};
    // subcontrollers for each segment
    this.segmentLightingControllers = [];

    segmentIds.forEach((segmentId) => {
      let pixels = this.pixels.slice.apply(
        this.pixels,
        SEGMENTID_TO_PIXEL_RANGE[segmentId]
      );
      this.segmentLightingControllers.push(
        new SegmentLightingController(this.store, {
          segmentId,
          pixels
        })
      )
    });

    // create FadecandyController (and initiate connection)
    this.fcController = new FadecandyController(this.store);

    // start render loop
    if (!process.env.DISABLE_LIGHTING) {
      setInterval(this.tick.bind(this), 50);
    }
  }

  tick () {
    TWEEN.update();
    this.fcController.writePixels(this.pixels);
  }

  quit () {
  }
}

export default LightingController;
