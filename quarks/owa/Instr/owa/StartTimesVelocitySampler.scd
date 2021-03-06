/**
 *  @class        StartTimesVelocitySampler
 *
 *  @classdesc    Takes a buffer of startTimes into the sample buffer.  Useful
 *  for storing multiple velocities in a single audio file.
 *
 *  @param  {bufnum}  startTimesByVelocity - A 127 size buffer, element 0
 *  is the start time (in seconds) of the note with velocity 1, etc.
 *  @param  {bufnum}  sampleBufNum - The sample to play starting at `startTime`.
 **/
Instr("owa.StartTimesVelocitySampler", {
  arg gate,
    amp = 1.0,
    velocity,
    startTimesByVelocity,
    sample,
    sampleDur,
    numChannels = 2,
    rate = 1.0;

  var startTime = Index.kr(startTimesByVelocity, velocity - 1),
    samplePlayer,
    env;

  samplePlayer = PlayBuf.ar(
    numChannels,
    sample,
    trigger: gate,
    startPos: (startTime / BufDur.kr(sample)) * BufFrames.kr(sample),
    rate: rate
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
  [0, 127],
  \bufnum,
  \bufnum,
  [0, 100],
  [0, 64],
  [-100, 100]
]);
