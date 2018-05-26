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
    bufnum,
    sustain = 0;

  var out,
    env;

  if (sustain != 0, {
    gate = Trig.kr(gate, Tempo.beats2secs(sustain)); 
  });

  env = Env.adsr(
    attackTime: 0.05,
    decayTime: 0.0,
    sustainLevel: 1.0,
    releaseTime: 0.2
  );
  
  out = EnvGen.ar(env, gate: gate, doneAction: 2) * PlayBuf.ar(
    2,
    bufnum,
    rate: 1.0,
    trigger: gate,
    startPos: 0
  );

  out;

}, [
  \gate,
  \buffer,
  \sustain
]);
