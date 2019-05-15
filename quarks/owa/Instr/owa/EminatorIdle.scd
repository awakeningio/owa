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
  arg gate,
    amp = 1.0,
    attackTime = 1.0,
    releaseTime = 1.0;
  
  var out, env, drone, dust, dustVerbMix;
  env = EnvGen.ar(
    Env.asr(attackTime, 1.0, releaseTime),
    gate,
    // This synth is never freed
    doneAction: Done.none
  );

  // Phasing rocket sound
	drone = SinOsc.ar(
    10 + (
      50 * SinOsc.kr(
        freq: 50,
        phase: 0,
        mul: SinOsc.kr(
          101,
          Saw.kr(0.12345, 800, 50),
          //0.0,
          0.2,
          0.8
        ),
        add: Pulse.kr(25, 0.25, 0.125, -0.25)
      )
    ),
    0,
    0.5,
    0
  );
  drone = 24.0.dbamp() * BLowShelf.ar(drone, 150, 0.8, -24.0);
  drone = -13.0.dbamp() * LPF.ar(in: drone, freq: SinOsc.kr(0.01).range(800, 8000));

  dust = -0.0.dbamp() * RHPF.ar(
    in: Dust2.ar(density: SinOsc.kr(0.01).range(0.1, 3.0)),
    freq: SinOsc.kr(0.01).range(800, 16000),
    rq: 0.7
  );
  dust = dust + (-3.0.dbamp() * JPverb.ar(
    dust,
    t60: 36.0,
    damp: 0.5,
    size: 0.5,
    earlyDiff: 0.5,
    modDepth: 0.0,
    modFreq: 2.0,
    low: 1.0,
    mid: 1.0,
    high: 1.0,
    lowcut: 500.0,
    highcut: 20000.0
  ));

  out = env * amp * (drone + dust);

  out;
}, [
  \gate,
  \amp,
  [0.01, 200.0],
  [0.01, 200.0]
]);
