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
      \amp, -30.0.dbamp(),
      \degree, Prand([
        Pseq([8, 2, 3, 7]),
        Pseq([8, 5, 7, 0]),
        Pseq([7, 7, 7, 7])
      ], inf),
      \dur, Prand([
        Pseq([4, 4, 4, 4]),
        Pseq([2, 2, 2, 2])
      ], inf),
      \scale, Scale.major,
      \root, 1,
      \octave, Prand([
        Pseq([5, 5, 5, 5, 5]),
        Pseq([6, 6, 6, 6, 6]),
      ], inf),
      \legato, Pseq([0.3, 0.15], inf),
      \doFreqSweep, Pwrand([0, 1], [0.75, 0.25], inf),
      \freqSweepTargetMultiplier, Prand([4.0, 2.0, 0.5], inf),
      \noteDuration, Pfunc({
        arg event;
        event[\legato] * event[\dur] * clock.tempo;
      })
    ).asStream();
  }
}
