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
    amp: LinExp.kr(velocity, 0, 127, -6.0.dbamp(), -0.0.dbamp()),
    velocity: velocity,
    startTimesByVelocity: electronicStartTimesBufnum,
    sample: electronicSampleBufnum,
    sampleDur: 0.5
  ));

  acoustic = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: gate,
    amp: -12.0.dbamp(),
    velocity: velocity,
    startTimesByVelocity: acousticStartTimesBufnum,
    sample: acousticSampleBufnum,
    sampleDur: 0.5
  ));

  out = synthetic + acoustic;

  out = MidEQ.ar(out, 750, 1.5, 9.5);
  out = MidEQ.ar(out, 2.20*1000, 1.5, 9.5);
  out = HPF.ar(out, 325);
  
  out = -2.0.dbamp() * CompanderD.ar(
    out,
    thresh: -7.0.dbamp(),
    slopeBelow: 0.4,
    slopeAbove: 0.2,
    clampTime: 0.005,
    relaxTime: 0.3
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
