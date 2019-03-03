/**
 *  @file       EminatorIdle.scd
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2019 awakening.io
 *  @license    Licensed under the GPLv3 license.
 **/

Instr("owa.EminatorIdle", {
  arg gate = 1,
    amp = 1.0,
    releaseTime = 1.0;
  
  var out, env;
  env = EnvGen.ar(
    Env.asr(1.0, 1.0, releaseTime),
    gate,
    doneAction: Done.freeSelf
  );
	out = SinOsc.ar(
    10 + (
      50 * SinOsc.kr(
        50,
        0,
        SinOsc.kr(
          101,
          Saw.kr(0.12345, 600, 50),
          //0.0,
          0.2,
          0.8
        ),
        Pulse.kr(25, 0.25, 0.125, -0.25)
      )
    ),
    0,
    0.5,
    0
  );

  out = 24.0.dbamp() * BLowShelf.ar(out, 150, 0.8, -24.0);

  out = env * out;

  out;
}, [
  \gate,
  \amp,
  [0.01, 200.0]
]);