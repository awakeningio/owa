/**
 *  @class        StartTimesIndexSampler
 *
 *  @classdesc    Takes a buffer of start times into the sample buffer then
 *  uses a provided index to playback the slice.
 *
 *  @param  {bufnum}  startTimesByIndex - A buffer containing start times in
 *  seconds of the slices.
 *  @param  {bufnum}  sample - The buffer containing all the slices.
 **/
Instr("owa.StartTimesIndexSampler", {
  arg gate,
    amp = 1.0,
    startTimesByIndex,
    sample,
    index,
    sampleDur,
    numChannels = 2;

  var startTime = Index.kr(startTimesByIndex, index),
    samplePlayer,
    env;


  samplePlayer = PlayBuf.ar(
    numChannels,
    sample,
    trigger: gate,
    startPos: (startTime / BufDur.kr(sample)) * BufFrames.kr(sample)
  );

  env = EnvGen.ar(
    Env.perc(0, sampleDur, 1.0, 24),
    gate: gate,
    doneAction: Done.none
  );
  amp * env * samplePlayer;
}, [
  \gate,
  \amp,
  \bufnum,
  \bufnum,
  [0, 1000000],
  [0, 100],
  [0, 64]
]);
