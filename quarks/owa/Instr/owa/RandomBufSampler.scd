Instr("owa.StartTimesVelocitySampler", {
  arg gate,
    amp,
    startTimesByVelocityBufNum,
    sampleBufNum,
    numChannels = 2;

  var startTime = Index.kr(startTimesByVelocityBufNum, velocity - 1);

  PlayBuf.ar(
    numChannels,
    sampleBufNum,
    trigger: gate,
    startPos: (startTime / BufDur.kr(sampleBufnum)) * BufFrames.kr(sampleBufnum)
  );
});
