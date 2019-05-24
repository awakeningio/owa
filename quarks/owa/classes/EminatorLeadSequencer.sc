EminatorLeadSequencer : AwakenedSequencer {
  var synthdef;

  initPatch {
    var sampleManager = OWASampleManager.getInstance(); 
    var leadSamplerManager = sampleManager.getVoiceSampleManager('lead');
    
    synthdef = Patch("owa.eminator.Lead", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-13.0.dbamp(), \amp),
      startTimesByVelocity: leadSamplerManager.startTimesBuf.bufnum
    )).asSynthDef().add();
  }

  initStream {
    var sampleManager = OWASampleManager.getInstance(); 
    var leadSamplerManager = sampleManager.getVoiceSampleManager('lead');
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
