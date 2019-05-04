/**
 *  @class        StartTimesVelocitySampler
 *
 *  @classdesc    Takes a buffer of startTimes into the sample buffer.  Useful
 *  for storing multiple velocities in a single audio file.
 *
 *  @param  {bufnum}  startTimesByVelocityBufNum - A 127 size buffer, element 0
 *  is the start time (in seconds) of the note with velocity 1, etc.
 *  @param  {bufnum}  sampleBufNum - The sample to play starting at `startTime`.
 **/
Instr("owa.StartTimesVelocitySampler", {
  arg gate,
    amp,
    velocity,
    startTimesByVelocityBufNum,
    sampleBufnum,
    sampleDur,
    numChannels = 2;

  var startTime = Index.kr(startTimesByVelocityBufNum, velocity - 1),
    samplePlayer,
    env;

  samplePlayer = PlayBuf.ar(
    numChannels,
    sampleBufnum,
    trigger: gate,
    startPos: (startTime / BufDur.kr(sampleBufnum)) * BufFrames.kr(sampleBufnum)
  );

  env = EnvGen.ar(
    Env.perc(0, sampleDur, -4),
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
  [0, 64]
]);
