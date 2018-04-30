/**
 *  @file       testLightingConfig.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/


import {configureStore} from "./configureStore"
import LightingController from './LightingController'
import { SEGMENTID_TO_PIXEL_RANGE } from './constants'

const owaStateStore = configureStore();
const lightingController = new LightingController(owaStateStore);

function set_for_two_seconds (pixels, r, g, b) {
  return new Promise(resolve => {
    var i;
    for (i = 0; i < pixels.length; i++) {
      pixels.setPixel(i, r, g, b);
    }
    setTimeout(resolve, 2000);
  });
}
function test_range (segmentId) {
  return new Promise(resolve => {
    let pixelRange = SEGMENTID_TO_PIXEL_RANGE[segmentId];
    let pixels = lightingController.segmentPixels[segmentId];

    console.log("segmentId");
    console.log(segmentId);
    console.log("pixelRange");
    console.log(pixelRange);

    // all black
    var i;
    for (i = 0; i < lightingController.pixels.length; i++) {
      lightingController.pixels.setPixel(i, 0, 0, 0);
    }

    // illuminate range
    return set_for_two_seconds(pixels, 255, 0, 0).then(() => {
      set_for_two_seconds(pixels, 0, 255, 0).then(() => {
        set_for_two_seconds(pixels, 0, 0, 255).then(resolve);
      })
    });
  });
}
var segmentIds = Object.keys(SEGMENTID_TO_PIXEL_RANGE);
var i = 0;
function test_next_segment () {
  if (i < segmentIds.length) {
    test_range(segmentIds[i++]).then(test_next_segment);
  }
}
test_next_segment();
