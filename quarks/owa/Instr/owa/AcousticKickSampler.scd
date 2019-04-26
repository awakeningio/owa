Instr("owa.AcousticKickSampler", {
  arg gate = 1,
    amp = 1.0,
    startTime = 0.0,
    bufnum;

  var out,
    samplePlayer,
    env;

  samplePlayer = PlayBuf.ar(
    2,
    bufnum,
    trigger: gate,
    startPos: (startTime / BufDur.kr(bufnum)) * BufFrames.kr(bufnum)
  );

  env = Env.perc(0.005, 1.0, curve: 4.0);

  out = amp * EnvGen.ar(
    env,
    gate: gate,
    doneAction: Done.freeSelf
  ) * samplePlayer;

  out;
}, [
  \gate,
  \amp,
  [0.0, 10000],
  \buffer
]);
