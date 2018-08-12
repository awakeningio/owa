/**
 *  @file       Pixels.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

export function setPixelsColors (pixels, color) {
  var i;
  var colorArray = color.rgb().round().color;
  for (i = 0; i < pixels.length; i++) {
    pixels.setPixel(i, colorArray[0], colorArray[1], colorArray[2]);
  }
}

export function setPixelColors (pixels, i, color) {
  pixels.setPixel.apply(
    pixels,
    [Math.round(i)].concat(color.rgb().round().color)
  );
}
