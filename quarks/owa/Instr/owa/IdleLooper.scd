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
    gate = 1,
    attackTime = 1.0,
    releaseTime = 1.0,
    amp = 1.0;

  var out, env;

  env = Linen.kr(gate, attackTime, 1.0, releaseTime, Done.freeSelf);
  out = env * amp * DiskIn.ar(buf.numChannels, buf.bufnum, loop: 1);

  [out, out];
}, [
  \buffer,
  \gate
]);
