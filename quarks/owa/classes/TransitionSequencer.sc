/**
 *  @file       TransitionSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

TransitionSequencer : AwakenedSequencer {
  initStream {
    var bufName = currentState.bufName.asSymbol();
    ^Pbind(
      \type, \instr,
      \instr, "cs.sfx.PlayBuf",
      \buf, bufManager.bufs[bufName],
      \attackTime, currentState.attackTime,
      \releaseTime, currentState.releaseTime,
      \midinote, Pseq(["C3".notemidi()]),
      \dur, currentState.numBeats
    ).asStream();
  }
}
