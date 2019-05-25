EminatorWhispPopSequencer : AwakenedSequencer {
  var synthdef;

  initPatch {
    var sampleManager = OWASampleManager.getInstance(); 
    var highPopSamplerManager = sampleManager.getVoiceSampleManager('high-pop');
    
    synthdef = Patch("owa.eminator.HighPop", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      startTimesByVelocity: highPopSamplerManager.startTimesBuf.bufnum,
    )).asSynthDef().add();
  }

  initStream {
    var sampleManager = OWASampleManager.getInstance(); 
    var highPopSamplerManager = sampleManager.getVoiceSampleManager('high-pop');
    ^Pbind(
      \instrument, synthdef.name,
      \midinote, Pseq([Pseq([\rest, "D5".notemidi()], 7), Pseq([\rest, "D4".notemidi()], 7)], inf),
      \dur, Pseq([1], inf),
      \velocity, Pseq([100], inf),
      [\sample, \samplemidinote, \sampleFreq], highPopSamplerManager.sampleAndSampleNotePattern(),
      \sendGate, false
    ).asStream();
  }
}