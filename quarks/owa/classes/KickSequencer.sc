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
  var pat,
    patchSynth;
  initPatch {
    patch = Patch("cs.sfx.PlayBuf", (
      buf: bufManager.bufs[\kick_01],
      convertToStereo: 1,
      attackTime: 0.0,
      releaseTime: 0.0,
      gate: 0
    ));
    patch.prepareForPlay();
    patchSynth = patch.asSynthDef().add();
    ^patch;
  }
  initStream {
    var note = "C1".notemidi();

    pat = Pbind(
      \instrument, patchSynth.name,
      \gate, 1,
      \midinote, Pseq([note, \rest, \rest, note, note, \rest, \rest, note], inf),
      \dur, Pseq([1], inf)
    );
    ^pat.asStream();
  }
}
