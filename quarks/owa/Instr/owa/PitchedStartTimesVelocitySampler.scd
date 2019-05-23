Instr("owa.PitchedStartTimesVelocitySampler", {
  arg gate,
    amp = 1.0,
    velocity,
    startTimesByVelocity,
    sample,
    sampleDur,
    numChannels = 2,
    freq,
    sampleFreq;

  var sampler,
    rate;

  rate = freq / sampleFreq * BufRateScale.kr(sample);

  sampler = Instr.ar("owa.StartTimesVelocitySampler", (
    gate: gate,
    amp: amp,
    velocity: velocity,
    startTimesByVelocity: startTimesByVelocity,
    sample: sample,
    sampleDur: sampleDur,
    numChannels: numChannels,
    rate: rate
  ));

  sampler;

}, [
  \gate,
  \amp,
  [0, 127],
  \bufnum,
  \bufnum,
  [0, 100],
  [0, 64],
  \freq,
  [0.0, 24000]
]);
