Instr("owa.eminator.SharpEerieSampler", {
  arg gate,
    amp,
    sampleBufnum;

  var out,
    env;

  env = EnvGen.ar(
    Env.perc(0.0, BufDur.kr(sampleBufnum) + 0.20, 1.0, 48),
    gate,
    doneAction: Done.freeSelf
  );

  out = amp * PlayBuf.ar(
    1,
    sampleBufnum,
    trigger: gate
  )
}, [
  \gate,
  \amp,
  \bufnum
]);
