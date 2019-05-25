EminatorKickSnareSequencer : AwakenedSequencer {
  var kickSynthdef,
    snareSynthdef,
    acousticKickSamplerManager,
    electronicSnareSampleManager,
    acousticSnareSampleManager,
    lastSessionPhase;

  initPatch {
    var sampleManager = OWASampleManager.getInstance();

    acousticKickSamplerManager = sampleManager.getVoiceSampleManager('acoustic_kick');
    electronicSnareSampleManager = sampleManager.getVoiceSampleManager('electronic_snare');
    acousticSnareSampleManager = sampleManager.getVoiceSampleManager('acoustic_snare');

    kickSynthdef = Patch("owa.EminatorKick", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-0.0.dbamp(), \amp),
      acousticStartTimesBufnum: acousticKickSamplerManager.startTimesBuf.bufnum
    )).asSynthDef().add();

    snareSynthdef = Patch("owa.EminatorSnare", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-0.0.dbamp(), \amp),
      electronicStartTimesBufnum: electronicSnareSampleManager.startTimesBuf.bufnum,
      acousticStartTimesBufnum: acousticSnareSampleManager.startTimesBuf.bufnum
    )).asSynthDef().add();
  }

  updateNotes {
    var state = store.getState(),
      kickMidiKey,
      snareMidiKey,
      sessionPhase;

    sessionPhase = state.sessionPhase.asSymbol();

    kickMidiKey = switch(sessionPhase, 
      \QUEUE_TRANS_6, {
        'eminator_kick_L6';
      },
      \QUEUE_TRANS_4, {
        'eminator_kick_L4';
      },
      \QUEUE_TRANS_2, {
        'eminator_kick_L2'
      }
    );

    if (kickMidiKey !== nil, {
      Pdefn(
        'EminatorKickNotes',
        Pseq(bufManager.midiSequences[kickMidiKey], inf)
      );
    });
    Pdefn('EminatorKickNotes').quant = currentState.playQuant;

    snareMidiKey = switch(sessionPhase,
      \QUEUE_TRANS_6, {
        'eminator_snare_L6';
      },
      \QUEUE_TRANS_4, {
        'eminator_snare_L4';
      },
      \QUEUE_TRANS_2, {
        'eminator_snare_L2';
      }
    );

    if (snareMidiKey !== nil, {
      Pdefn(
        'EminatorSnareNotes',
        Pseq(bufManager.midiSequences[snareMidiKey], inf)
      );
    });
    Pdefn('EminatorSnareNotes').quant = currentState.playQuant;
  }

  initStream {
    var kickPat, snarePat;
    kickPat = Pbind(
      \instrument, kickSynthdef.name,
      \velocity, Pseq([110], inf),
      [\midinoteFromFile, \dur], Pdefn('EminatorKickNotes'),
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
      [\midinote, \dur], Pdefn('EminatorSnareNotes'),
      \velocity, Pseq([110], inf),
      \electronicSampleBufnum, electronicSnareSampleManager.sampleBufnumPattern(),
      \acousticSampleBufnum, acousticSnareSampleManager.sampleBufnumPattern()
    );

    ^Ppar([
      kickPat,
      snarePat
    ]).asStream();
  }

  handleStateChange {
    var state = store.getState();
    var sessionPhase = state.sessionPhase.asSymbol();
    
    super.handleStateChange();

    if (lastSessionPhase !== sessionPhase, {
      this.updateNotes();
      lastSessionPhase = sessionPhase;
    });
  }
}
