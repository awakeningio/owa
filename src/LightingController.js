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
import { SEGMENTID_TO_PIXEL_RANGE } from './constants'

import createOPCStrand from "opc/strand"

/**
 *  @class        LightingController
 *
 *  @classdesc    Top-level controller for all things lighting.  Intiailizes
 *  pixel buffers, sets up Fadecandy connection, etc.
 **/
class LightingController extends ControllerWithStore {
  init() {
    // create our pixel buffer
    this.pixels = createOPCStrand(144);

    // grab ranges of pixel buffer for each segment
    this.segmentPixels = {};
    Object.keys(SEGMENTID_TO_PIXEL_RANGE).forEach((segmentId) => {
      this.segmentPixels[segmentId] = this.pixels.slice.apply(
        this.pixels,
        SEGMENTID_TO_PIXEL_RANGE[segmentId]
      );
    });

    // create FadecandyController (and initiate connection)
    this.fcController = new FadecandyController(this.store);

    // start render loop
    if (!process.env.TEST) {
      setInterval(this.tick.bind(this), 50);
    }
  }

  tick () {
    this.fcController.writePixels(this.pixels);
  }

  quit () {
  }
}

export default LightingController;
