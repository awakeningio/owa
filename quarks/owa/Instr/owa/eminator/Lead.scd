Instr("owa.eminator.Lead", {
  arg gate,
    amp = -24.0.dbamp(),
    velocity,
    startTimesByVelocity,
    sample,
    freq,
    sampleFreq;

  var samplePlayer,
    env,
    out,
    sampleDur = 60.0/140.0 * 4.0 / 8.0;

  samplePlayer = Instr.ar("owa.PitchedStartTimesVelocitySampler", (
    gate: gate,
    velocity: velocity,
    startTimesByVelocity: startTimesByVelocity,
    sample: sample,
    sampleDur: sampleDur,
    numChannels: 1,
    freq: freq,
    sampleFreq: sampleFreq
  ));

  env = EnvGen.ar(
    Env.adsr(0, 0, 1.0, 0.2, curve: 4),
    gate: gate,
    doneAction: Done.freeSelf
  );

  out = env * amp * samplePlayer;

  [out, out];
}, [
  \gate,
  \amp,
  [0, 127],
  \bufnum,
  \bufnum,
  \freq,
  [0.0, 24000]
]);
