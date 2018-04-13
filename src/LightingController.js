/**
 *  @file       LightingController.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import FadecandyController from './FadecandyController';
import createOPCStrand from "opc/strand"

/**
 *  @class        LightingController
 *
 *  @classdesc    Top-level controller for all things lighting.  Intiailizes
 *  pixel buffers, sets up Fadecandy connection, etc.
 **/
class LightingController {
  constructor(store) {
    this.store = store;

    // create our pixel buffer
    this.fcPixels = createOPCStrand(144);

    // create FadecandyController (and initiate connection)
    this.fcController = new FadecandyController(store);
  }
}

export default LightingController;
