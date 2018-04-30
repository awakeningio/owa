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

    // create FadecandyController (and initiate connection)
    this.fcController = new FadecandyController(this.store);

    // start render loop
    setInterval(this.tick.bind(this), 33);
  }

  tick () {
    this.fcController.writePixels(this.pixels);
  }
}

export default LightingController;
