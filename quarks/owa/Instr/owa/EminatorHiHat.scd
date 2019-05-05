Instr("owa.EminatorHiHat", {
  arg gate = 1,
    amp = 1.0,
    velocity,
    sustainTime = 1,
    openHat = 0, // 0 is closed hihat, 1 is open
    acousticClosedStartTimes,
    acousticOpenStartTimes,
    acousticClosedSample,
    acousticOpenSample,
    electronicClosedStartTimes,
    electronicOpenStartTimes,
    electronicClosedSample,
    electronicOpenSample;

  var acousticClosed,
    acousticOpen,
    electronicClosed,
    electronicOpen,
    out,
    trig,
    trigTime,
    acousticAmp = -8.0.dbamp(),
    env;

  trigTime = sustainTime + (openHat * 0.15);

  trig = Trig.kr(gate, trigTime);

  acousticClosed = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: trig * (1.0 - openHat),
    amp: acousticAmp,
    velocity: velocity,
    startTimesByVelocity: acousticClosedStartTimes,
    sample: acousticClosedSample,
    sampleDur: trigTime
  ));

  acousticOpen = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: trig * openHat,
    amp: acousticAmp,
    velocity: velocity,
    startTimesByVelocity: acousticOpenStartTimes,
    sample: acousticOpenSample,
    sampleDur: trigTime
  ));

  electronicClosed = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: gate * (1.0 - openHat),
    velocity: velocity,
    startTimesByVelocity: electronicClosedStartTimes,
    sample: electronicClosedSample,
    sampleDur: trigTime
  ));

  electronicOpen = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: gate * openHat,
    velocity: velocity,
    startTimesByVelocity: electronicOpenStartTimes,
    sample: electronicOpenSample,
    sampleDur: trigTime
  ));

  env = EnvGen.ar(
    Env.adsr(
      attackTime: 0,
      decayTime: 0,
      sustainLevel: 1.0,
      releaseTime: 0.2
    ),
    gate: trig,
    doneAction: Done.freeSelf
  );

  out = acousticClosed + acousticOpen + electronicClosed + electronicOpen;

  out = env * amp * out;

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
  \bufnum,
  \bufnum,
  \bufnum,
  \bufnum
]);
