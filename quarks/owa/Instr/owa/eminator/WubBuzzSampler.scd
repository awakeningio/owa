Instr("owa.eminator.WubBuzzSampler", {
  arg gate,
    amp,
    startTimes,
    sample,
    index;

  var out,
    env,
    dur = 0.9;

  env = EnvGen.ar(
    Env.perc(0.0, dur, 1.0, 48),
    gate: gate,
    doneAction: Done.freeSelf
  );

  out = amp * env * Instr.ar("owa.StartTimesIndexSampler", (
    gate: gate,
    startTimesByIndex: startTimes,
    sample: sample,
    index: index,
    sampleDur: 0.8
  ));

  out;
}, [
  \gate,
  \amp,
  \bufnum,
  \bufnum
]);
