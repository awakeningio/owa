Instr("owa.EminatorKick", {
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

  synthetic = Instr.ar("owa.SyntheticKick", (
    gate: gate,
    amp: -4.0.dbamp() * amp,
    freq: freq,
    velocity: velocity,
    doneAction: Done.none
  ));

  acoustic = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: gate,
    amp: -22.0.dbamp() * amp,
    velocity: velocity,
    startTimesByVelocity: acousticStartTimesBufnum,
    sample: acousticSampleBufnum,
    sampleDur: 0.5
  ));

  acoustic = RHPF.ar(in: acoustic, freq: 79.1, rq: 0.72, mul: 1.0, add: 0.0);
  acoustic = RLPF.ar(in: acoustic, freq: 4.84*1000, rq: 0.4, mul: 1.0, add: 0.0);
  out = synthetic + acoustic;

  out = MidEQ.ar(out, 140, 1.8, -7);
  out = MidEQ.ar(out, 70, 1.5, 12);

  env = EnvGen.ar(
    Env.perc(0, 1.5),
    gate: gate,
    doneAction: Done.freeSelf
  );

  //distorted = SmoothDecimator.ar(
    //out,
    //rate: 0.90 * SampleRate.ir(),
    //smoothing: 0.5,
    //mul: -12.dbamp()
  //);

  out = -4.0.dbamp() * CompanderD.ar(
    out,
    thresh: -8.0.dbamp(),
    slopeBelow: 0.6,
    slopeAbove: 0.4,
    clampTime: 0.005,
    relaxTime: 0.01
  );

  out = amp * env * out;
  //out = [out, out];

}, [
  \gate,
  \amp,
  \freq,
  [0, 127],
  \bufnum,
  \bufnum
]);

