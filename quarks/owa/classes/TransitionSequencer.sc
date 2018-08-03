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
    var bufName = currentState.bufName.asSymbol(),
      synthdef;

    patch = Patch("cs.sfx.PlayBuf", (
      buf: bufManager.bufs[bufName],
      attackTime: currentState.attackTime,
      releaseTime: currentState.releaseTime,
      gate: KrNumberEditor(1, \gate),
      isSustained: 1
    ));
    synthdef = patch.asSynthDef().add();
    ^Pbind(
      \instrument, synthdef.name,
      \midinote, Pseq(["C3".notemidi()]),
      \dur, currentState.numBeats
    ).asStream();
  }
}
