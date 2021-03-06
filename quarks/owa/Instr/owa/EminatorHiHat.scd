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
    electronicOpenSample,
    sustained = false;

  var acousticClosed,
    acousticOpen,
    electronicClosed,
    electronicOpen,
    out,
    trig,
    trigTime,
    acousticAmp = -12.0.dbamp(),
    electronicAmp = -3.0.dbamp(),
    env;

  trigTime = sustainTime + (openHat * 0.1);
  if (sustained == false, {
    trig = Trig.kr(gate, trigTime);
  }, {
    trig = gate;
  });

  acousticClosed = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: trig * (1.0 - openHat),
    amp: acousticAmp,
    velocity: velocity,
    startTimesByVelocity: acousticClosedStartTimes,
    sample: acousticClosedSample,
    sampleDur: 0.5,
    numChannels: 1
  ));

  acousticOpen = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: trig * openHat,
    amp: acousticAmp,
    velocity: velocity,
    startTimesByVelocity: acousticOpenStartTimes,
    sample: acousticOpenSample,
    sampleDur: 3.0,
    numChannels: 1
  ));

  electronicClosed = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: trig * (1.0 - openHat),
    amp: electronicAmp,
    velocity: velocity,
    startTimesByVelocity: electronicClosedStartTimes,
    sample: electronicClosedSample,
    sampleDur: 0.5,
    numChannels: 1
  ));

  electronicOpen = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: trig * openHat,
    amp: electronicAmp,
    velocity: velocity,
    startTimesByVelocity: electronicOpenStartTimes,
    sample: electronicOpenSample,
    sampleDur: 2.0,
    numChannels: 1
  ));

  env = EnvGen.ar(
    Env.adsr(
      attackTime: 0,
      decayTime: 0,
      sustainLevel: 1.0,
      releaseTime: 0.1
    ),
    gate: trig,
    doneAction: Done.freeSelf
  );

  out = electronicClosed + electronicOpen + acousticClosed + acousticOpen;


  out = RHPF.ar(in: out, freq: 2.5*1000, rq: 0.6134);
  out = -6.0.dbamp() * BHiShelf.ar(in: out, freq: 2670, rs: 1.0, db: 5.0);
  
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
  \bufnum,
  \bufnum,
  \bufnum,
  \bufnum,
  ObjectSpec(false)
]);
