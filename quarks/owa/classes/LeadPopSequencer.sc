/**
 *  @file       LeadPopSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

LeadPopSequencer : AwakenedSequencer {
  var patch,
    synthdef;
  initStream {
    var pat;

    patch = Patch("cs.percussion.Impulsive", (
      makeStereo: 1
    ));
    synthdef = patch.asSynthDef().add();
    pat = Pbind(
      //\type, \instr,
      //\instr, "cs.percussion.Impulsive",
      \instrument, synthdef.name,
      [\midinote, \dur], Pseq(
        bufManager.midiSequences['spinny-pluck_L6_lead'],
        inf
      ),
      \amp, 1.0.dbamp()
    );
    ^pat.asStream();
  }
}
