Instr("owa.eminator.HighPop", {
  arg gate,
    amp = 1.0,
    velocity,
    startTimesByVelocity,
    sample,
    freq,
    sampleFreq;

  var samplePlayer,
    env,
    out,
    sampleDur = 60.0/140.0;

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
    Env.perc(0, sampleDur, 1.0, 24),
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
