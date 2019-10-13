EminatorKickSnareInstrument {
  var bufManager,
    <pattern,
    acousticKickSampleProvider,
    electSnareSampleProvider,
    acoustSnareSampleProvider;
  *new {
    arg params;
    ^super.new().init(params);
  }
  *getSampleProviderMetadatasToLoadList {
    ^[
      (
        name: 'acoustic_kick',
        metadataFilePath: "acoustic_kick.json",
        class: PercussionVoiceSampleManager
      ),
      (
        name: 'electronic_snare',
        metadataFilePath: "electronic_snare.json",
        class: PercussionVoiceSampleManager
      ),
      (
        name: 'acoustic_snare',
        metadataFilePath: "acoustic_snare.json",
        class: PercussionVoiceSampleManager
      ),
    ]
  }
  init {
    arg params;
    var kickPatch, snarePatch, snareSynthDef, kickSynthDef;

    bufManager = params['bufManager'];
    acousticKickSampleProvider = bufManager.getSampleProvider('acoustic_kick');
    electSnareSampleProvider = bufManager.getSampleProvider('electronic_snare');
    acoustSnareSampleProvider = bufManager.getSampleProvider('acoustic_snare');
    
    snarePatch = Patch("owa.EminatorSnare", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-0.0.dbamp(), \amp),
      electronicStartTimesBufnum: electSnareSampleProvider.startTimesBuf.bufnum,
      acousticStartTimesBufnum: acoustSnareSampleProvider.startTimesBuf.bufnum
    ));
    snareSynthDef = snarePatch.asSynthDef().add();

    kickPatch = Patch("owa.EminatorKick", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-0.0.dbamp(), \amp),
      acousticStartTimesBufnum: acousticKickSampleProvider.startTimesBuf.bufnum
    ));
    kickSynthDef = kickPatch.asSynthDef().add();

    pattern = Ppar([
      Pbind(
        \instrument, snareSynthDef.name,
        [\midinote, \dur], Pdefn('EminatorSnareNotes'),
        \velocity, Pseq([110], inf),
        \electronicSampleBufnum, electSnareSampleProvider.sampleBufnumPattern(),
        \acousticSampleBufnum, acoustSnareSampleProvider.sampleBufnumPattern()
      ),
      Pbind(
        \instrument, kickSynthDef.name,
        \velocity, Pseq([110], inf),
        [\midinoteFromFile, \dur], Pdefn('EminatorKickNotes'),
        \midinote, Pfunc({
          arg e;
          //"e['midinoteFromFile']:".postln;
          //e['midinoteFromFile'].postln;
          "D0".notemidi();
        }),
        \acousticSampleBufnum, acousticKickSampleProvider.sampleBufnumPattern(),
      )
    ]);
  }
  updateForSessionPhase {
    arg sessionPhase;

    var snareMidiKey;
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

    snareMidiKey = switch(sessionPhase,
      \TRANS_6, {
        'eminator_snare_L6';
      },
      \TRANS_4, {
        'eminator_snare_L4';
      },
      \TRANS_2, {
        'eminator_snare_L2';
      }
    );

    if (snareMidiKey !== nil, {
      Pdefn(
        'EminatorSnareNotes',
        Pseq(bufManager.midiSequences[snareMidiKey], inf)
      );
    });
  }

  updatePropQuant {
    arg quant;

    Pdefn('EminatorKickNotes').quant = quant;
    Pdefn('EminatorSnareNotes').quant = quant;
  }
}
