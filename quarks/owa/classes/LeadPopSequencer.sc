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
  initStream {
    var pat;
    pat = Pbind(
      \type, \instr,
      \instr, "cs.percussion.Impulsive",
      [\midinote, \dur], Pseq(
        bufManager.midiSequences['spinny-pluck_L6_lead'],
        inf
      ),
    );
    ^pat.asStream();
  }
}
