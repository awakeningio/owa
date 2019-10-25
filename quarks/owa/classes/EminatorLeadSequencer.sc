EminatorLeadSequencer : AwakenedSequencer {
  var synthdef;

  initPatch {
    var leadSamplerManager = bufManager.getSampleProvider('lead');
    var patch = Patch("owa.eminator.Lead", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      startTimesByVelocity: leadSamplerManager.startTimesBuf.bufnum
    ));
    patch.gate.lag = 0;
    
    synthdef = patch.asSynthDef().add();
  }

  initStream {
    var leadSamplerManager = bufManager.getSampleProvider('lead');
    ^Pbind(
      \instrument, synthdef.name,
      //\midinote, Pseq(["D4".notemidi(), \rest], inf),
      //\dur, 1,
      [\midinote, \dur], Pseq(bufManager.midiSequences['eminator_lead_L2'], inf),
      \velocity, 100,
      [\sample, \samplemidinote, \sampleFreq], leadSamplerManager.sampleAndSampleNotePattern()
    ).asStream();
  }
}
