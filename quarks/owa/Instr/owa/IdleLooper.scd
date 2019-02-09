/**
 *  @file       IdleLooper.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

Instr("owa.IdleLooper", {
  arg buf,
    gate,
    attackTime = 1.0,
    releaseTime = 1.0,
    amp = 1.0;

  var out, env;

  // this synth is not freed
  env = Linen.kr(gate, attackTime, 1.0, releaseTime, Done.none);
  out = env * amp * PlayBuf.ar(buf.numChannels, buf.bufnum, loop: 1);

}, [
  \buffer,
  \gate
]);
