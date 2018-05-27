/**
 *  @file       PitchedSampler.scd
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

Instr("owa.PitchedSampler", {
  arg gate = 1,
    freq,
    originalFreq,
    amp = 1.0,
    bufnum,
    // defaults below with specs
    sustain,
    releaseTime,
    attackTime,
    reversed,
    startTime;

  var out,
    samplePlayer,
    reverseMult,
    env;

  if (sustain != 0, {
    gate = Trig.kr(gate, Tempo.beats2secs(sustain)); 
  });

  env = Env.adsr(
    attackTime: attackTime,
    decayTime: 0.0,
    sustainLevel: 1.0,
    releaseTime: releaseTime
  );

  if (reversed != 0, {
    reverseMult = -1.0;
  }, {
    reverseMult = 1.0;
  });

  samplePlayer = PlayBuf.ar(
    2,
    bufnum,
    rate: (reverseMult * freq / originalFreq) * BufRateScale.kr(bufnum),
    trigger: gate,
    startPos: (startTime / BufDur.kr(bufnum)) * BufFrames.kr(bufnum)
  );
  
  out = amp * EnvGen.ar(
    env,
    gate: gate,
    doneAction: 2
  ) * samplePlayer;

  out;
}, [
  \gate,
  \freq,
  \freq,
  \amp,
  \buffer,
  \sustain,
  // releaseTime
  ObjectSpec(0.2),
  // attackTime
  ObjectSpec(0.05),
  // reversed
  ObjectSpec(0),
  // startTime
  ObjectSpec(0.0)
]);
