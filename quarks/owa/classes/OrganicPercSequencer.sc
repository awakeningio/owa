/**
 *  @file       OrganicPercSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

OrganicPercSequencer : AwakenedSequencer {
  var synthdef;
  initPatch {
    synthdef = Patch("cs.fm.OrganicPercussion", (
      //gate: KrNumberEditor(1.0, \gate),
      gate: 1,
      autoDurationOn: 1
    )).asSynthDef().add();
  }

  initStream {
    ^Pbind(
      \instrument, synthdef.name,
      \amp, -48.0.dbamp(),
      \degree, Prand([
        Pseq([0, 3, 5, 8]),
        Pseq([8, 5, 3, 0]),
        Pseq([\rest, 9, 9]),
        Pseq([10, 12, 13, 14])
      ], inf),
      \dur, Prand([
        Pseq([0.5, 0.33, 0.33, 0.33, 0.33, 0.33, 0.33]),
        Pseq([0.5, 0.5, 0.5, 0.5])
      ], inf),
      \scale, Scale.major,
      \root, 1,
      \octave, 5,
      \legato, Pseq([0.3, 0.15], inf),
      \doFreqSweep, Pwrand([0, 1], [0.75, 0.25], inf),
      \freqSweepTargetMultiplier, Prand([2.0, 0.5], inf),
      \noteDuration, Pfunc({
        arg event;
        event[\legato] * event[\dur] * clock.tempo;
      })
    ).asStream();
  }
}
