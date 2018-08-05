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
      \amp, -24.0.dbamp(),
      \degree, Pseq([0, 3, 5, 8], inf),
      \dur, Pseq([0.5], inf),
      \scale, Scale.major,
      \root, 1,
      \octave, 5,
      \legato, Pseq([0.3, 0.15], inf),
      \doFreqSweep, 0,
      \noteDuration, Pfunc({
        arg event;
        event[\legato] * event[\dur] * clock.tempo;
      })
    ).asStream();
  }
}
