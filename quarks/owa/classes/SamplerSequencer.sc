/**
 *  @file       SamplerSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

SamplerSequencer : AwakenedSequencer {
  var pat,
    patStream,
    patchSynth;

  initPatch {
    patch = Patch("cs.sfx.PlayBuf", (
      buf: bufManager.bufs[\subtle_kick_01],
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
    pat = Pbind(
      \instrument, patchSynth.name,
      \gate, 1,
      [\midinote, \dur], Pseq(bufManager.midiSequences[\subtle_kick], inf)
    );
    ^pat.asStream();
  }
}
