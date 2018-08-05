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
    bufs,
    patch,
    synthdefs;

  initPatch {
    var patch, openPatch, restPatch;
    
    patch = Patch("owa.HiHatSampler", (
      bufnum: bufManager.bufs[\hhclosed_96].bufnum,
      gate: 1
    ));

    openPatch = Patch("owa.HiHatSampler", (
      bufnum: bufManager.bufs[\hhopen_83].bufnum,
      gate: 1
    ));

    restPatch = Patch("owa.HiHatSampler", (
      bufnum: -1,
      gate: 1
    ));

    synthdefs = (
      22: patch.asSynthDef().add(),
      25: openPatch.asSynthDef().add(),
      rest: restPatch.asSynthDef().add()
    );

  }
  initStream {
    bufs = (
      22: bufManager.bufs[\hhclosed_96].bufnum,
      25: bufManager.bufs[\hhopen_83].bufnum,
      rest: -1
    );
    Pdefn('HiHatNotes').quant = currentState.playQuant;
    Pdefn('HiHatNotes', Pseq(
      bufManager.midiSequences[currentState.midiName.asSymbol()],
      inf
    ));
    pat = Pbind(
      //\type, \instr,
      //\instr, "owa.HiHatSampler",
      [\midinote, \dur], Pdefn('HiHatNotes'),
      \instrument, Pfunc({
        arg event;

        synthdefs[event[\midinote]].name;
      }),
      \sustainTime, Pfunc({
        arg event;

        (event[\dur] / clock.tempo);
      }),
      //\legato, Pfunc({
        //arg event;
        //if (event[\midinote] === 25, {
          //0.75;
        //}, {
          //1.0;
        //});
      //}),
      \sendGate, false
      //\bufnum, Pfunc({
        //arg event;
        //bufs[event[\midinote]];
      //})
    );
    ^pat.asStream();
  }
  handleStateChange {
    super.handleStateChange();
    Pdefn('HiHatNotes', Pseq(
      bufManager.midiSequences[currentState.midiName.asSymbol()],
      inf
    ));
  }
}
