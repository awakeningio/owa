Instr("owa.eminator.SharpEerieSampler", {
  arg gate,
    amp = 24.0.dbamp(),
    sampleBufnum;

  var out,
    env;

  env = EnvGen.ar(
    Env.perc(0.0, BufDur.kr(sampleBufnum) + 0.20, 1.0, 48),
    gate,
    doneAction: Done.freeSelf
  );

  out = amp * env * PlayBuf.ar(
    1,
    sampleBufnum,
    trigger: gate
  );
  [out, out];
}, [
  \gate,
  \amp,
  \bufnum
]);
