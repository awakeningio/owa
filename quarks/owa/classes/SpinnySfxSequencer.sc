/**
 *  @file       SpinnySfxSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

SpinnySfxSequencer : AwakenedSequencer {
  var patch,
    synthdef;
  initPatch {

    patch = Patch("cs.sfx.PlayBuf", (
      buf: bufManager.bufs['spinny-pluck_L6_sfx'],
      attackTime: 0.0,
      releaseTime: 0.0,
      gate: KrNumberEditor(1, \gate),
      isSustained: 1
    ));
    patch.gate.lag = 0;
    synthdef = patch.asSynthDef().add();
  }
  initStream {
    // TODO: break this out into multiple streams, currently it's all together
    // in a single loop
    ^Pbind(
      \instrument, synthdef.name,
      \midinote, Pseq(["C3".notemidi()], inf),
      \dur, Pseq([currentState.numBeats], inf),
      \legato, 1.0,
      \amp, 3.0.dbamp(),
      \sendGate, true
    ).asStream();
  }
}
