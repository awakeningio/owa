Instr("owa.OWAKick", {
  arg gate = 1,
    amp = 1.0,
    freq = 55,
    velocity,
    acousticStartTimesByVelocity,
    acousticBufnums;

  var synthetic,
    acoustic,
    env,
    out;

  synthetic = Instr.ar("owa.SyntheticKick", (
    gate: gate,
    amp: -1.0.dbamp() * amp,
    freq: freq,
    velocity: velocity,
    doneAction: Done.none
  ));

  acoustic = Instr.ar("owa.AcousticKickSampler", (
    gate: gate,
    amp: -8.0.dbamp() * amp,
    velocity: velocity,
    startTimesByVelocity: acousticStartTimesByVelocity,
    bufnums: acousticBufnums,
    doneAction: Done.none
  ));

  out = acoustic + synthetic;

  env = EnvGen.ar(
    Env.perc(0, 2),
    gate: gate,
    doneAction: Done.freeSelf
  );

  out = env * out;

  out = CompanderD.ar(
    out,
    thresh: 0.3,
    slopeBelow: 1.0,
    slopeAbove: 0.8,
    clampTime: 0.005,
    relaxTime: 0.1
  );


  //out = [out, out];

}, [
  \gate,
  \amp,
  \freq,
  [0, 127],
  ArraySpec.new([0.0, 10000].asSpec()),
  ArraySpec.new(\buffer)
]);

