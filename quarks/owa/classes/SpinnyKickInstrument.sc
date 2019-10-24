SpinnyKickInstrument {
  var bufManager,
    <pattern,
    note;

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
      )
    ]
  }
  init {

    arg params;
   
   var kickPatch,
    kickSynthDef,
    acousticKickSampleProvider;

    bufManager = params['bufManager'];
    note = "D0".notemidi();

    acousticKickSampleProvider = bufManager.getSampleProvider('acoustic_kick');
    kickPatch = Patch("owa.spinny.SpinnyKick", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-0.0.dbamp(), \amp),
      acousticStartTimesBufnum: acousticKickSampleProvider.startTimesBuf.bufnum
    ));
    kickSynthDef = kickPatch.asSynthDef().add();
  
    pattern = Pbind(
      \instrument, kickSynthDef.name,
      [\note, \dur, \velocity], Pdefn('SpinnyKick'),
      \midinote, note,
      \acousticSampleBufnum, acousticKickSampleProvider.sampleBufnumPattern(),
    );
  }
  useLevel6Variation {
    arg variationIndex;

    if (variationIndex == 0, {
      Pdefn('SpinnyKick', Ptuple([
        Pseq([
          note, \rest, \rest, note, note, \rest, \rest, note
        ], inf),
        Pseq([1], inf),
        Pmeanrand(60, 80, inf)
      ]));
    }, {
      Pdefn('SpinnyKick', Ptuple([
        Pseq([
          note, \rest, \rest, note, note, \rest, \rest, note
        ].scramble, inf),
        Pseq([1, 1, 1, 0.5, 0.5].scramble, inf),
        Pmeanrand(60, 80, inf)
      ]));
    });
  }
  updatePropQuant {
    arg quant;
    Pdefn('SpinnyKick').quant = quant;
  }
  updateForSessionPhase {
    arg sessionPhase;
    switch(sessionPhase,
      \TRANS_6, {
        this.useLevel6Variation(0);
      }
    );
  }
}
