Instr("owa.AcousticKickSampler", {
  arg gate = 1,
    amp = 1.0,
    velocity = 55,
    startTimesByVelocity,
    bufnums,
    doneAction = Done.freeSelf;

  var out,
    samplePlayer,
    env,
    bufnum = TChoose.kr(gate, bufnums),
    startTime = Select.kr(velocity, startTimesByVelocity);

  samplePlayer = PlayBuf.ar(
    2,
    bufnum,
    trigger: gate,
    startPos: (startTime / BufDur.kr(bufnum)) * BufFrames.kr(bufnum)
  );

  env = Env.perc(0.005, 1.5, curve: 4.0);

  out = amp * EnvGen.ar(
    env,
    gate: gate,
    doneAction: doneAction
  ) * samplePlayer;

  out;
}, [
  \gate,
  \amp,
  [0, 127],
  ArraySpec.new([0.0, 10000].asSpec()),
  ArraySpec.new(\buffer)
]);
