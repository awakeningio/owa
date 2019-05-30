/**
 *  @file       testLightingConfig.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/


import configureStore from "../configureStore"
import FadecandyController from '../FadecandyController';
import { SEGMENTID_TO_PIXEL_RANGE, SHELL_PIXEL_RANGE, NUM_PIXELS, SHELL_NUM_PYRAMIDS, SHELL_PYRAMID_PIXEL_RANGES } from 'owa/constants'

import createOPCStrand from "opc/strand"

const store = configureStore();
const fcController = new FadecandyController(store);

// create our pixel buffer
const allPixels = createOPCStrand(NUM_PIXELS);

function set_for_two_seconds (pixels, r, g, b) {
  return new Promise(resolve => {
    var i;
    for (i = 0; i < pixels.length; i++) {
      pixels.setPixel(i, r, g, b);
    }
    fcController.writePixels(allPixels);
    setTimeout(resolve, 2000);
  });
}

function all_off () {
  // all black
  var i;
  for (i = 0; i < allPixels.length; i++) {
    allPixels.setPixel(i, 0, 0, 0);
  }
  fcController.writePixels(allPixels);
}

function test_range (pixels) {
  all_off();

  return new Promise(resolve => {
    // illuminate range
    set_for_two_seconds(pixels, 255, 0, 0).then(() => {
      set_for_two_seconds(pixels, 0, 255, 0).then(() => {
        set_for_two_seconds(pixels, 0, 0, 255).then(resolve);
      });
    });
  });

}

function test_segment (segmentId) {
  const pixelRange = SEGMENTID_TO_PIXEL_RANGE[segmentId];

  console.log("segmentId");
  console.log(segmentId);
  console.log("pixelRange");
  console.log(pixelRange);

  return test_range(allPixels.slice.apply(
      allPixels,
      pixelRange
  ));
}

function test_shell () {
  console.log("Shell");
  console.log("SHELL_PIXEL_RANGE");
  console.log(SHELL_PIXEL_RANGE);
  return test_range(
    allPixels.slice.apply(allPixels, SHELL_PIXEL_RANGE)
  );
}

function test_segments () {
  return new Promise(resolve => {
    
    var segmentIds = Object.keys(SEGMENTID_TO_PIXEL_RANGE);
    var i = 0;
    function test_next_segment () {
      if (i < segmentIds.length) {
        test_segment(segmentIds[i++]).then(test_next_segment);
      } else {
        resolve();
      }
    }
    test_next_segment();
  });
}

function test_pyramids () {
  return new Promise(resolve => {
    
    var i = 0;
    function test_next_pyramid () {
      if (i < SHELL_NUM_PYRAMIDS) {
        const pixelRange = SHELL_PYRAMID_PIXEL_RANGES[i];
        console.log(`Pyramid ${i}`);
        console.log("pixelRange");
        console.log(pixelRange);
        test_range(allPixels.slice(pixelRange[0], pixelRange[1])).then(test_next_pyramid);
        i += 1;
      } else {
        resolve();
      }
    }
    test_next_pyramid();
  });
}

test_shell().then(test_pyramids).then(test_segments).then(() => {
  fcController.quit();
});

