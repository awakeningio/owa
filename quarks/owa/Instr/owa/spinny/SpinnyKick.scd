Instr("owa.spinny.SpinnyKick", {
  arg gate = 1,
    amp = 1.0,
    freq = 55,
    velocity,
    acousticStartTimesBufnum,
    acousticSampleBufnum;

  var synthetic,
    acoustic,
    env,
    distorted,
    out;

  acoustic = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: gate,
    amp: 1.0,
    velocity: velocity,
    startTimesByVelocity: acousticStartTimesBufnum,
    sample: acousticSampleBufnum,
    sampleDur: 0.5,
    numChannels: 1
  ));

  out = acoustic;
  env = EnvGen.ar(
    Env.perc(0, 1.5),
    gate: gate,
    doneAction: Done.freeSelf
  );
  out = CompanderD.ar(
    out,
    thresh: -10.0.dbamp(),
    slopeBelow: 0.6,
    slopeAbove: 0.4,
    clampTime: 0.005,
    relaxTime: 0.01
  ) * 4.0.dbamp();

  out = amp * env * out;
  [out, out];

}, [
  \gate,
  \amp,
  \freq,
  [0, 127],
  \bufnum,
  \bufnum
]);
