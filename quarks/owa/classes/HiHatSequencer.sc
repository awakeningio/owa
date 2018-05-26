/**
 *  @file       HiHatSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

HiHatSequencer : AwakenedSequencer {
  var pat,
    bufs;

  //initPatch {
    
    //patch = Patch("owa.HiHatSampler", (
    //));
    //patch.prepareForPlay();
    //patchSynth = patch.asSynthDef().add();
    //^patch;

  //}
  initStream {
    bufs = (
      22: bufManager.bufs[\hhclosed_96].bufnum,
      25: bufManager.bufs[\hhopen_83].bufnum,
      rest: -1
    );
    pat = Pbind(
      \type, \instr,
      \instr, "owa.HiHatSampler",
      [\midinote, \dur], Pseq(
        bufManager.midiSequences['spinny-pluck_L6_hats'],
        inf
      ),
      \legato, Pfunc({
        arg event;
        if (event[\midinote] === 25, {
          0.75;
        }, {
          1.0;
        });
      }),
      \bufnum, Pfunc({
        arg event;
        bufs[event[\midinote]];
      })
    );
    ^pat.asStream();
  }
}
