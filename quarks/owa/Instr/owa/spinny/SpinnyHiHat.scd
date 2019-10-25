Instr("owa.spinny.SpinnyHiHat", {
  arg gate = 1,
    amp = -12.0.dbamp(),
    velocity,
    sustainTime = 1,
    openHat = 0, // 0 is closed hihat, 1 is open
    closedStartTimes,
    openStartTimes,
    closedSample,
    openSample,
    sustained = false;

  var closed,
    open,
    out,
    trig,
    trigTime,
    env;

  trigTime = sustainTime;
  if (sustained == false, {
    trig = Trig.kr(gate, trigTime);
  }, {
    trig = gate;
  });

  closed = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: trig * (1.0 - openHat),
    amp: amp,
    velocity: velocity,
    startTimesByVelocity: closedStartTimes,
    sample: closedSample,
    sampleDur: 0.5,
    numChannels: 1
  ));
  open = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: trig * openHat,
    amp: amp,
    velocity: velocity,
    startTimesByVelocity: openStartTimes,
    sample: openSample,
    sampleDur: 3.0,
    numChannels: 1
  ));
  
  env = EnvGen.ar(
    Env.adsr(
      attackTime: 0,
      decayTime: 0,
      sustainLevel: 1.0,
      releaseTime: 0.01
    ),
    gate: trig,
    doneAction: Done.freeSelf
  );

  out = closed + open;
  out = env * amp * out;

  [out, out];

}, [
  \gate,
  \amp,
  [0, 127],
  [0, 100],
  [0, 1],
  \bufnum,
  \bufnum,
  \bufnum,
  \bufnum,
  ObjectSpec(false)
]);
