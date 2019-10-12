EminatorKickInstrument {
  var bufManager, <patch, <pattern, acousticKickSampleProvider;
  *new {
    arg params;
    ^super.new().init(params);
  }
  *getSampleProviderMetadatasToLoadList {
    ^[(
      name: 'acoustic_kick',
      metadataFilePath: "acoustic_kick.json",
      class: PercussionVoiceSampleManager
    )]
  }
  init {
    arg params;

    bufManager = params['bufManager'];
    acousticKickSampleProvider = bufManager.getSampleProvider('acoustic_kick');
    
    patch = Patch("owa.EminatorKick", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-0.0.dbamp(), \amp),
      acousticStartTimesBufnum: acousticKickSampleProvider.startTimesBuf.bufnum
    ));
    pattern = Pbind(
      \instrument, patch.asSynthDef().add().name,
      \velocity, Pseq([110], inf),
      [\midinoteFromFile, \dur], Pdefn('EminatorKickNotes'),
      \midinote, Pfunc({
        arg e;
        //"e['midinoteFromFile']:".postln;
        //e['midinoteFromFile'].postln;
        "D0".notemidi();
      }),
      \acousticSampleBufnum, acousticKickSampleProvider.sampleBufnumPattern(),
    );
  }

  updateForSessionPhase {
    arg sessionPhase;

    var kickMidiKey = switch(sessionPhase, 
      \TRANS_6, {
        'eminator_kick_L6';
      },
      \TRANS_4, {
        'eminator_kick_L4';
      },
      \TRANS_2, {
        'eminator_kick_L2'
      }
    );

    if (kickMidiKey !== nil, {
      Pdefn(
        'EminatorKickNotes',
        Pseq(bufManager.midiSequences[kickMidiKey], inf)
      );
    });
  }

  updatePropQuant {
    arg quant;

    Pdefn('EminatorKickNotes').quant = quant;
  }
}
