Instr("owa.eminator.SharpEerieSampler", {
  arg gate,
    amp = 24.0.dbamp(),
    sampleBufnum,
    dur = 1.0,
    rate = 1.0;

  var out,
    env;

  env = EnvGen.ar(
    //Env.perc(0.0, sampleDurMult * (BufDur.kr(sampleBufnum) + 0.20), 1.0, 48),
    Env.perc(0.0, dur, 1.0, 48),
    gate,
    doneAction: Done.freeSelf
  );

  out = amp * env * PlayBuf.ar(
    1,
    sampleBufnum,
    trigger: gate,
    rate: rate,
    doneAction: Done.none
  );
  [out, out];
}, [
  \gate,
  \amp,
  \bufnum
]);
