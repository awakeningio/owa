/**
 *  @file       ChordProgSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

ChordProgSequencer : AwakenedSequencer {
  initStream {
    var bufName = currentState.bufName.asSymbol();
    ^Pbind(
      \type, \instr,
      \instr, "cs.sfx.PlayBuf",
      \buf, bufManager.bufs[bufName],
      \attackTime, 0.0,
      \releaseTime, 0.0,
      \midinote, "C3".notemidi(),
      \dur, currentState.numBeats
    ).asStream();
  }
}
