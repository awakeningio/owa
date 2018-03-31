/**
 *  @file       LazersSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

LazersSequencer : AwakenedSequencer  {
  var patchSynth;
  initPatch {
    var p = Patch("cs.fm.Lazers", (
      gate: 1
    ));
    p.prepareForPlay();
    patchSynth = p.asSynthDef().add();
    ^p;
  }
  initStream {
    ^Pbind(
      \instrument,   patchSynth.name,
      \dur,     Prand([
        Pseq([1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4]),
        Pseq([1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4]),
        Pseq([1/16, 1/16, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4]),
        Pseq([1/8, 1/8, 1/8, 1/8, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4, 1/4])
      ], inf),
      \amp,     0.1,
      \carrierReleaseTime, Pfunc({ exprand(0.025, 0.1) }),
      \mod2ReleaseTime, Pfunc({ exprand(0.01, 0.2) }),
      \modIndex,  Pfunc({ exprand(0.01, 6) }),
      \mod2Index,  Pfunc({ exprand(0.02, 6) })
    ).asStream();
  }
}
