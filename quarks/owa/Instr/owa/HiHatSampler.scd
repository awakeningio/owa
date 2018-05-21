/**
 *  @file       HiHatSampler.scd
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

Instr("owa.HiHatSampler", {
  arg gate = 1,
    bufnum;

  var out,
    env;

  gate.poll(label: 'gate');

  env = Env.adsr(
    attackTime: 0.0,
    decayTime: 0.0,
    sustainLevel: 1.0,
    releaseTime: 0.0
  );
  
  out = PlayBuf.ar(
    2,
    bufnum,
    rate: 1.0,
    trigger: gate,
    startPos: 0
  );

  out;

}, [
  \gate,
  \bufnum
]);
