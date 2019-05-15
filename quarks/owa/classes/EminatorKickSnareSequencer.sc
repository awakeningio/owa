EminatorKickSnareSequencer : AwakenedSequencer {
  var kickSynthdef,
    snareSynthdef,
    acousticKickSamplerManager,
    electronicSnareSampleManager,
    acousticSnareSampleManager;

  initPatch {
    var sampleManager = OWASampleManager.getInstance();

    acousticKickSamplerManager = sampleManager.getVoiceSampleManager('acoustic_kick');
    electronicSnareSampleManager = sampleManager.getVoiceSampleManager('electronic_snare');
    acousticSnareSampleManager = sampleManager.getVoiceSampleManager('acoustic_snare');

    kickSynthdef = Patch("owa.EminatorKick", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-6.0.dbamp(), \amp),
      acousticStartTimesBufnum: acousticKickSamplerManager.startTimesBuf.bufnum
    )).asSynthDef().add();

    snareSynthdef = Patch("owa.EminatorSnare", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-6.0.dbamp(), \amp),
      electronicStartTimesBufnum: electronicSnareSampleManager.startTimesBuf.bufnum,
      acousticStartTimesBufnum: acousticSnareSampleManager.startTimesBuf.bufnum
    )).asSynthDef().add();
  }

  initStream {
    var kickPat, snarePat;
    kickPat = Pbind(
      \instrument, kickSynthdef.name,
      \velocity, Pseq([110], inf),
      [\midinoteFromFile, \dur], Pseq(bufManager.midiSequences[\eminator_kick_L6], inf),
      \midinote, Pfunc({
        arg e;
        //"e['midinoteFromFile']:".postln;
        //e['midinoteFromFile'].postln;
        "D0".notemidi();
      }),
      \acousticSampleBufnum, acousticKickSamplerManager.sampleBufnumPattern(),
    );

    snarePat = Pbind(
      \instrument, snareSynthdef.name,
      [\midinote, \dur], Pseq(bufManager.midiSequences[\eminator_snare_L6], inf),
      \velocity, Pseq([110], inf),
      \electronicSampleBufnum, electronicSnareSampleManager.sampleBufnumPattern(),
      \acousticSampleBufnum, acousticSnareSampleManager.sampleBufnumPattern()
    );

    ^Ppar([
      kickPat,
      snarePat
    ]).asStream();
  }
}
