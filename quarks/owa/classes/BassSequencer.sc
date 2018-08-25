/**
 *  @file       BassSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

BassSequencer : AwakenedSequencer {
  initStream {
    var pat,
      notes,
      patch,
      synthdef;

    patch = Patch("cs.fm.WideBass", (
      amp: -24.dbamp(),
      gate: 1,
      useSustain: 1
    ));
    synthdef = patch.asSynthDef().add();

    notes = ["C#0", "D0"].notemidi();

    pat = Pbind(
      \instrument, synthdef.name,
      \note, Pseq(notes, inf),
      \octave, 2,
      \dur, 4,
      \sustain, 3.5,
      \sustainTime, Pfunc({
        arg event;
        (event[\sustain] / clock.tempo);
      }),
      \attackModFreq, Pseq(12 + notes, inf),
      \toneModulatorGainMultiplier, 1.0,
      \toneModulatorLFOAmount, 2.0,
      \toneModulatorLFORate, 1.5,
      \sendGate, true
    );

    ^pat.asStream();
  }
}
