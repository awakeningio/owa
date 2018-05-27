/**
 *  @file       ChimeSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

ChimeSequencer : AwakenedSequencer {
  initStream {
    var originalFreq = "C4".notemidi().midicps();

    ^Ppar([
      Pbind(
        \type, \instr,
        \instr, "owa.PitchedSampler",
        \originalFreq, originalFreq,
        \scale, Scale.minor,
        \root, 2,
        \octave, 5,
        \degree, Pseq([
          \rest,  0,   \rest
        ], inf),
        \dur, Pseq([
          7,      0.5,  0.5
        ], inf),
        \reversed, Pseq([
          0
        ], inf),
        \bufnum, bufManager.bufs[\chime_ring_d].bufnum,
        \amp, -20.dbamp(),
        \releaseTime, 5.0,
        \attackTime, 0.3
      ),
      Pbind(
        \type, \instr,
        \instr, "owa.PitchedSampler",
        \originalFreq, originalFreq,
        \scale, Scale.minor,
        \root, 2,
        \octave, 4,
        \degree, Pseq([
          \rest,  4,  \rest,
        ], inf),
        \dur, Pseq([
          1,      6,  1
        ], inf),
        \reversed, Pseq([
          1
        ], inf),
        \bufnum, bufManager.bufs[\chime_ring_d].bufnum,
        \amp, -20.dbamp(),
        \releaseTime, 5.0,
        \attackTime, 0.3,
        \startTime, 3.5
      )
    ]).asStream();
  }
}
