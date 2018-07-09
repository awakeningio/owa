/**
 *  @file       KickSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

KickSequencer : AwakenedSequencer {
  initStream {
    var note = "C1".notemidi();

    ^Pbind(
      \type, \instr,
      \instr, "cs.sfx.PlayBuf",
      \buf, bufManager.bufs[\kick_01],
      \convertToStereo, 1,
      \attackTime, 0.0,
      \releaseTime, 0.0,
      \midinote, Pseq([
        note, \rest, \rest, note, note, \rest, \rest, note
      ], inf),
      \dur, Pseq([1], inf),
      \amp, 3.0.dbamp()
    ).asStream();
  }
}
