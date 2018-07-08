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
      notes;
    
    notes = ["C#0", "D0"].notemidi();

    pat = Pbind(
      \amp, -28.dbamp(),
      \type, \instr,
      \instr, "cs.fm.WideBass",
      \note, Pseq(notes, inf),
      \octave, 2,
      \dur, 4,
      \sustain, 3.5,
      \attackModFreq, Pseq(12 + notes, inf),
      \toneModulatorGainMultiplier, 1.0,
      \toneModulatorLFOAmount, 2.0,
      \toneModulatorLFORate, 1.5,
      \sendGate, true
    );

    ^pat.asStream();
  }
}
