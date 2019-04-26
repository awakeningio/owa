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
    releaseTime = 0.0,
    attackTime = 0.0,
    reversed = 0,
    startTime = 0.0;

  var out,
    samplePlayer,
    reverseMult,
    env;

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
    doneAction: Done.freeSelf
  ) * samplePlayer;

  out;
}, [
  \gate,
  \freq,
  \freq,
  \amp,
  \buffer,
  // releaseTime
  ObjectSpec(0.2),
  // attackTime
  ObjectSpec(0.05),
  // reversed
  ObjectSpec(0),
  // startTime
  ObjectSpec(0.0)
]);
