Instr("owa.eminator.HighPop", {
  arg gate,
    amp = 1.0,
    velocity,
    startTimesByVelocity,
    sample,
    sampleDur,
    freq,
    sampleFreq;

  var samplePlayer,
    env,
    out;

  samplePlayer = Instr.ar("owa.PitchedStartTimesVelocitySampler", (
    gate: gate,
    velocity: velocity,
    startTimesByVelocity: startTimesByVelocity,
    sample: sample,
    sampleDur: sampleDur,
    numChannels: 2,
    freq: freq,
    sampleFreq: sampleFreq
  ));

  env = EnvGen.ar(
    Env.perc(0, sampleDur, 1.0, 24),
    gate: gate,
    doneAction: Done.freeSelf
  );

  out = env * amp * samplePlayer;

  out;
}, [
  \gate,
  \amp,
  [0, 127],
  \bufnum,
  \bufnum,
  [0, 100],
  \freq,
  [0.0, 24000]
]);
    Env.perc(0, 140.0/60*0.5, 1.0, 24).plot()
