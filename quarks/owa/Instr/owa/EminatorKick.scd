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
    amp: -0.0.dbamp() * amp,
    freq: freq,
    velocity: velocity,
    doneAction: Done.none
  ));

  acoustic = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: gate,
    amp: -4.0.dbamp() * amp,
    velocity: velocity,
    startTimesByVelocity: acousticStartTimesBufnum,
    sample: acousticSampleBufnum,
    sampleDur: 0.5
  ));

  out = synthetic + acoustic;
  out = RHPF.ar(in: out, freq: 79.1, rq: 0.72, mul: 1.0, add: 0.0);
  out = RLPF.ar(in: out, freq: 484000, rq: 0.2, mul: 1.0, add: 0.0);

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

  out = CompanderD.ar(
    out,
    thresh: -10.0.dbamp(),
    slopeBelow: 0.6,
    slopeAbove: 0.4,
    clampTime: 0.005,
    relaxTime: 0.3,
    mul: 2.0.dbamp()
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

