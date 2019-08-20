/**
 *  @file       Pixels.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

//import { getEnvAsNumber } from './utils';

// a master brightness scalar [0.0 - 1.0]
//const MASTER_BRIGHTNESS = getEnvAsNumber('MASTER_BRIGHTNESS') || 1.0;
//const MASTER_BRIGHTNESS_FACTOR = MASTER_BRIGHTNESS * 100.0;

// pixel values below this will be set to 0 [0 - 255]
//const MINIMUM_CUTOFF = 3;

//function applyMasterBrightness (color) {
  //return color.value((color.value() / 100.0) * MASTER_BRIGHTNESS_FACTOR);
//}
//function applyLowCutoff (rgb) {
  //let i;
  //for (i = 0; i < rgb.length; i++) {
    //if (rgb[i] < MINIMUM_CUTOFF) {
      //rgb[i] = 0;
    //}
  //}
  //return rgb;
//}
function setPixelsRGB (pixels, colorArray) {
  var i;
  for (i = 0; i < pixels.length; i++) {
    pixels.setPixel(i, colorArray[0], colorArray[1], colorArray[2]);
  }
}
export function setPixelsColors (pixels, color) {
  //var colorArray = applyLowCutoff(
    //applyMasterBrightness(color).rgb().round().color
  //);
  const colorArray = color.rgb().color;
  setPixelsRGB(pixels, colorArray);
}

export function setPixelColors (pixels, i, color) {
  pixels.setPixel.apply(
    pixels,
    [i].concat(
      color.rgb().color
      //applyLowCutoff(applyMasterBrightness(color).rgb().round().color)
    )
  );
}

const black = [0, 0, 0];
export function setPixelsOff (pixels) {
  setPixelsRGB(pixels, black);
}
