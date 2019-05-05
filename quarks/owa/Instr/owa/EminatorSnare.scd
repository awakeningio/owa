Instr("owa.EminatorSnare", {
  arg gate = 1,
    amp = 1.0,
    velocity,
    electronicStartTimesBufnum,
    acousticStartTimesBufnum,
    electronicSampleBufnum,
    acousticSampleBufnum;

  var synthetic,
    acoustic,
    env,
    out;

  synthetic = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: gate,
    amp: LinExp.kr(velocity, 0, 127, -18.0.dbamp(), 0.0.dbamp()),
    velocity: velocity,
    startTimesByVelocity: electronicStartTimesBufnum,
    sample: electronicSampleBufnum,
    sampleDur: 0.5
  ));

  acoustic = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: gate,
    amp: -18.0.dbamp(),
    velocity: velocity,
    startTimesByVelocity: acousticStartTimesBufnum,
    sample: acousticSampleBufnum,
    sampleDur: 0.5
  ));

  out = synthetic + acoustic;
  
  out = CompanderD.ar(
    out,
    thresh: -10.0.dbamp(),
    slopeBelow: 0.6,
    slopeAbove: 0.4,
    clampTime: 0.005,
    relaxTime: 0.3,
    mul: 2.0.dbamp()
  );

  env = EnvGen.ar(
    Env.perc(0, 1.5),
    gate: gate,
    doneAction: Done.freeSelf
  );

  out = amp * env * out;

}, [
  \gate,
  \amp,
  [0, 127],
  \bufnum,
  \bufnum,
  \bufnum,
  \bufnum
]);
