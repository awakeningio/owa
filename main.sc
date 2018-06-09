/**
 *  @file       main.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

({

  "Setting up".postln();

  MIDIClient.init;
  MIDIIn.connectAll;
  API.mountDuplexOSC();
  //s.options.inDevice = "JackRouter";
  //s.options.outDevice = "JackRouter";
  //s.options.memSize = 8192 * 2 * 2 * 2;
  //s.options.blockSize = 8;

  s.waitForBoot({
    OWAController.initInstance();
  });

  s.boot();

}.value());
