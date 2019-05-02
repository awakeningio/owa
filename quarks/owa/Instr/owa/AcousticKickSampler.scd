Instr("owa.AcousticKickSampler", {
  arg gate = 1,
    amp = 1.0,
    velocity = 55,
    startTimesBufnum,
    sampleBufnum;

  var out,
    samplePlayer,
    env,
    startTime = Index.kr(startTimesBufnum, velocity - 1);

  samplePlayer = PlayBuf.ar(
    2,
    sampleBufnum,
    trigger: gate,
    startPos: (startTime / BufDur.kr(sampleBufnum)) * BufFrames.kr(sampleBufnum)
  );

  env = Env.perc(0.005, 1.5, curve: 4.0);

  out = amp * EnvGen.ar(
    env,
    gate: gate,
    doneAction: Done.freeSelf,
  ) * samplePlayer;

  out;
}, [
  \gate,
  \amp,
  [0, 127],
  \bufnum,
  \bufnum
]);
