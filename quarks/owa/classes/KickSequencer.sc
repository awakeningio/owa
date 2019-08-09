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
    var note = "C1".notemidi(),
      patch,
      synthdef;

    patch = Patch("cs.sfx.PlayBuf", (
      buf: bufManager.bufs[\kick_01],
      convertToStereo: 1,
      attackTime: 0.0,
      releaseTime: 0.0,
      amp: 1.0.dbamp(),
      gate: KrNumberEditor(1, \gate)
    ));
    patch.gate.lag = 0;
    synthdef = patch.asSynthDef().add();

    ^Pbind(
      //\type, \instr,
      //\instr, "cs.sfx.PlayBuf",
      //\buf, bufManager.bufs[\kick_01],
      //\convertToStereo, 1,
      \instrument, synthdef.name,
      \midinote, Pseq([
        note, \rest, \rest, note, note, \rest, \rest, note
      ], inf),
      \dur, Pseq([1], inf)
    ).asStream();
  }
}
