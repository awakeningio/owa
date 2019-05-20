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
    releaseTime = 1.0,
    transitionGate = 0,
    transitionDuration = 10.0;
  
  var out, env, drone, dust, dustVerbMix, transitionProgress;

  env = EnvGen.ar(
    Env.asr(attackTime, 1.0, releaseTime),
    gate,
    // This synth is never freed
    doneAction: Done.none
  );

  //transitionProgress = Linen.kr(gate: transitionGate, attackTime: transitionDuration);
  //transitionProgress = Env.perc(
    //attackTime: transitionDuration,
    //releaseTime: 0,
    //curve: \lin
  //).range(50, 90).kr(gate: transitionGate);

  //transitionProgress.poll();

  //transitionGate.poll();

  // Phasing rocket sound
	drone = SinOsc.ar(
    10 + (
      Env.perc(
        attackTime: transitionDuration,
        releaseTime: 0,
        curve: \lin
      ).range(50, 90).kr(gate: transitionGate) * SinOsc.kr(
        freq: 50,
        phase: 0,
        mul: SinOsc.kr(
          101,
          Saw.kr(0.12345, 800, 50),
          //0.0,
          0.2,
          0.8
        ),
        add: Pulse.kr(
          freq: Env.perc(
            attackTime: transitionDuration,
            releaseTime: 0,
            curve: \lin
          ).range(25, 250).kr(gate: transitionGate),
          width: Env.perc(
            attackTime: transitionDuration,
            releaseTime: 0,
            curve: \lin
          ).range(0.25, 0.01).kr(gate: transitionGate),
          mul: 0.125,
          add: Env.perc(
            attackTime: transitionDuration,
            releaseTime: 0,
            curve: \lin
          ).range(-0.25, 0.5).kr(gate: transitionGate)
        )
      )
    ),
    0,
    0.5,
    0
  );
  drone = 24.0.dbamp() * BLowShelf.ar(drone, 150, 0.8, -24.0);
  drone = -13.0.dbamp() * LPF.ar(
    in: drone,
    freq: SinOsc.kr(
      Env.perc(
        attackTime: transitionDuration,
        releaseTime: 0,
        curve: 4
      ).range(0.01, 4).kr(gate: transitionGate)
    ).range(
      Env.perc(
        attackTime: transitionDuration,
        releaseTime: 0,
        curve: 4
      ).range(800, 4000).kr(gate: transitionGate),
      Env.perc(
        attackTime: transitionDuration,
        releaseTime: 0,
        curve: \lin
      ).range(8000, 16000).kr(gate: transitionGate)
    )
  );
  Env.perc(
        attackTime: transitionDuration,
        releaseTime: 0,
        curve: \lin
      ).range(16000, 1200).kr(gate: transitionGate);

  dust = -0.0.dbamp() * RHPF.ar(
    in: Dust2.ar(
      density: SinOsc.kr(0.01).range(
        Env.perc(
          attackTime: transitionDuration,
          releaseTime: 0,
          curve: \lin
        ).range(0.1, 4.0).kr(gate: transitionGate),
        Env.perc(
          attackTime: transitionDuration,
          releaseTime: 0,
          curve: \lin
        ).range(3.0, 6.0).kr(gate: transitionGate)
      )
    ),
    freq: SinOsc.kr(Env.perc(
        attackTime: transitionDuration,
        releaseTime: 0,
        curve: \lin
      ).range(0.01, 4).kr(gate: transitionGate)
    ).range(
      Env.perc(
        attackTime: transitionDuration,
        releaseTime: 0,
        curve: \lin
      ).range(800, 250).kr(gate: transitionGate),
      Env.perc(
        attackTime: transitionDuration,
        releaseTime: 0,
        curve: \lin
      ).range(16000, 1200).kr(gate: transitionGate)
    ),
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
  [0.01, 200.0],
  \unipolar,
  [0.01, 200.0]
]);
