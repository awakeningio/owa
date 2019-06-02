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
  arg amp = 1.0,
    gate = 1,
    attackTime = 1.0,
    releaseTime = 1.0,
    transitionGate = 0,
    transitionDuration = 10.0;
  
  var out,
    env,
    drone,
    dust,
    transitionProgress,
    transitionEnv,
    transitionEnvExp;

  env = EnvGen.ar(
    Env.asr(attackTime, 1.0, releaseTime),
    gate,
    doneAction: Done.freeSelf
  );

  //transitionProgress = Linen.kr(gate: transitionGate, attackTime: transitionDuration);
  //transitionProgress = Env.perc(
    //attackTime: transitionDuration,
    //releaseTime: 0,
    //curve: \lin
  //).range(50, 90).kr(gate: transitionGate);

  //transitionProgress.poll();

  //transitionGate.poll();

  transitionEnv = Env.perc(
    attackTime: transitionDuration,
    releaseTime: 0,
    curve: \lin
  ).kr(gate: transitionGate);

  transitionEnvExp = Env.perc(
    attackTime: transitionDuration,
    releaseTime: 0,
    curve: 4
  ).kr(gate: transitionGate);

  // Phasing rocket sound
	drone = SinOsc.ar(
    10 + (
      (transitionEnv * 40 + 50) * SinOsc.kr(
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
          freq: transitionEnv * 225 + 25,
          width: (1.0 - transitionEnv) * 0.24 + 0.01,
          mul: 0.125,
          add: transitionEnv.range(-0.25, 0.5)
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
      transitionEnvExp * 3.99 + 0.01
    ).range(
      transitionEnvExp * 3200 + 800,
      transitionEnv * 8000 + 8000
    )
  );
  dust = -0.0.dbamp() * RHPF.ar(
    in: Dust2.ar(
      density: SinOsc.kr(0.01).range(
        transitionEnv * 2.9 + 0.1,
        transitionEnv * 3.0 + 3.0
      )
    ),
    freq: SinOsc.kr((1.0 - transitionEnv) * 3.99 + 0.01).range(
      (1.0 - transitionEnv) * 550 + 250,
      (1.0 - transitionEnv) * 14800 + 1200
    ),
    rq: 0.7
  );
  //dust = dust + (-3.0.dbamp() * JPverb.ar(
    //dust,
    //t60: 36.0,
    //damp: 0.5,
    //size: 0.5,
    //earlyDiff: 0.5,
    //modDepth: 0.0,
    //modFreq: 2.0,
    //low: 1.0,
    //mid: 1.0,
    //high: 1.0,
    //lowcut: 500.0,
    //highcut: 20000.0
  //));

  out = env * amp * (drone + dust);

  out;
}, [
  \amp,
  \gate,
  [0.01, 200.0],
  [0.01, 200.0],
  \unipolar,
  [0.01, 200.0]
]);
