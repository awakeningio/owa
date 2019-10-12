EminatorSnareInstrument {
  var bufManager,
    <patch,
    <pattern,
    electronicSampleProvider,
    acousticSampleProvider;
  *new { arg params;
    ^super.new().init(params);
  }
  *getSampleProviderMetadatasToLoadList {
    ^[
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
    var synthdef;
    bufManager = params['bufManager'];

    electronicSampleProvider = bufManager.getSampleProvider('electronic_snare');
    acousticSampleProvider = bufManager.getSampleProvider('acoustic_snare');

    patch = Patch("owa.EminatorSnare", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-0.0.dbamp(), \amp),
      electronicStartTimesBufnum: electronicSampleProvider.startTimesBuf.bufnum,
      acousticStartTimesBufnum: acousticSampleProvider.startTimesBuf.bufnum
    ));
    synthdef = patch.asSynthDef().add();

    pattern = Pbind(
      \instrument, synthdef.name,
      [\midinote, \dur], Pdefn('EminatorSnareNotes'),
      \velocity, Pseq([110], inf),
      \electronicSampleBufnum, electronicSampleProvider.sampleBufnumPattern(),
      \acousticSampleBufnum, acousticSampleProvider.sampleBufnumPattern()
    );
    
  }

  updateForSessionPhase {
    arg sessionPhase;
    var snareMidiKey;

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
    Pdefn('EminatorSnareNotes').quant = quant;
  }
}
