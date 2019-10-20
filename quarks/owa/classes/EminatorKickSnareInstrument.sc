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
  *getMidiToLoadList {
    ^[
      (
        midiFileName: "eminator_kick_L2.mid",
        midiKey: 'eminator_kick_L2',
        makeDuration: 8 * 4,
        tempoBPM: OWAConstants.tempoBySongId['eminator']
      ),
      (
        midiFileName: "eminator_kick_L4.mid",
        midiKey: 'eminator_kick_L4',
        makeDuration: 8 * 4,
        tempoBPM: OWAConstants.tempoBySongId['eminator']
      ),
      (
        midiFileName: "eminator_snare_L2.mid",
        midiKey: 'eminator_snare_L2',
        makeDuration: 8 * 4,
        tempoBPM: OWAConstants.tempoBySongId['eminator']
      ),
      (
        midiFileName: "eminator_snare_L4.mid",
        midiKey: 'eminator_snare_L4',
        makeDuration: 8 * 4,
        tempoBPM: OWAConstants.tempoBySongId['eminator']
      )
    ];
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
        [\note, \dur, \velocity], Pdefn('EminatorSnare'),
        \midinote, "D1".notemidi(),
        \electronicSampleBufnum, electSnareSampleProvider.sampleBufnumPattern(),
        \acousticSampleBufnum, acoustSnareSampleProvider.sampleBufnumPattern()
      ),
      Pbind(
        \instrument, kickSynthDef.name,
        [\note, \dur, \velocity], Pdefn('EminatorKick'),
        \midinote, "D0".notemidi(),
        \acousticSampleBufnum, acousticKickSampleProvider.sampleBufnumPattern(),
      )
    ]);
  }
  useLevel6Variation {
    arg variationIndex;
    switch(variationIndex,
      0, {
        Pdefn('EminatorKick', 
          Ptuple([
            "D1".notemidi(),
            // kick dur
            Pseq([1, Rest(2), 1, 1, Rest(1), 1], inf),
            // kick vel
            Pmeanrand(50, 80, inf),
          ])
        );

        Pdefn('EminatorSnare', 
          Ptuple([
            "D0".notemidi(),
            // snare dur
            Pseq([Rest(1), 1, Rest(5)], inf),
            // snare vel
            Pmeanrand(50, 80, inf),
          ])
        );
      },
      1, {
        Pdefn('EminatorKick', 
          Ptuple([
            "D1".notemidi(),
            // kick dur
            Pseq([
              Pwrand([
                  Pseq([1/4, 1/4, 1/4, Rest(1/4)]),
                  Pseq([1])
                ],
                [
                  3, 1
                ].normalizeSum()
              ),
              1/4, Rest(3/4),
              1,
              1/2, 1/2,
              Pwrand([
                Pseq([Rest(1), 1/2, 1/2]),
                Pseq([Rest(1/2), 1/2, Rest(1/2), 1/2]),
              ], [
                3,
                1
              ].normalizeSum()),
              Rest(1/2), 1/2
            ], inf),
            // kick vel
            Pmeanrand(50, 80, inf),
          ])
        );

        Pdefn('EminatorSnare', 
          Ptuple([
            "D0".notemidi(),
            // snare dur
            Pseq([
              Rest(1),
              Pwrand([1, Rest(1)], [4, 1].normalizeSum()),
              Rest(2),
              Pwrand([1, Pseq([0.5, 0.5])], [4, 1].normalizeSum()),
              Rest(2)
            ], inf),
            // snare vel
            Pmeanrand(50, 80, inf),
          ])
        );
      },
      2, {
        // variation 3
        Pdefn('EminatorKick', 
          Ptuple([
            "D1".notemidi(),
            // kick dur
            Pseq([
              1/4, 1/4, Rest(1/2),
              1/2, 1/2,
              1,
              1/2, 1/2,
              Rest(1),
              1/2, 1/2,
              Rest(1/4), 1/4, Rest(1/2)
            ], inf),
            // kick vel
            Pmeanrand(50, 80, inf),
          ])
        );

        Pdefn('EminatorSnare',
          Pwrand([
            Ptuple([
              "D0".notemidi(),
              // snare dur
              Pseq([Rest(2.5), 1, 1, Rest(2), 1/2]),
              // snare vel
              Pseq([0] ++ Env.new([100, 20]).asSignal(4))
            ]),
            Ptuple([
              "D0".notemidi(),
              // snare dur
              Pseq([Rest(4.5), 1, 1, 1/2]),
              // snare vel
              Pseq([0] ++ Env.new([100, 20]).asSignal(3))
            ]),
            Ptuple([
              "D0".notemidi(),
              // snare dur
              Pseq([Rest(4)] ++ [1/2].stutter(6)),
              // snare vel
              Pseq([0] ++ Env.new([100, 20]).asSignal(6))
            ]),
            Ptuple([
              "D0".notemidi(),
              // snare dur
              Pseq([Rest(4)] ++ [1/4].stutter(3) ++ [Rest(1/4), Rest(2)]),
              // snare vel
              Pseq([0] ++ Env.new([100, 20]).asSignal(3))
            ]),
          ], [2, 2, 1, 1].normalizeSum(), inf)
        );
      }
    );
  }
  updateForSessionPhase {
    arg sessionPhase,
      snareMidiKey = nil,
      kickMidiKey = nil;

    switch(sessionPhase,
      \TRANS_6, {
        this.useLevel6Variation(0);
      },
      \TRANS_4, {
        kickMidiKey = 'eminator_kick_L4';
        snareMidiKey = 'eminator_snare_L4';
      },
      \TRANS_2, {
        kickMidiKey = 'eminator_kick_L2';
        snareMidiKey = 'eminator_snare_L2';
      }
    );

    if (kickMidiKey !== nil, {
      Pdefn(
        'EminatorKick',
        Pseq(bufManager.midiSequencesWithVel[kickMidiKey], inf)
      );
    });

    if (snareMidiKey !== nil, {
      Pdefn(
        'EminatorSnare',
        Pseq(bufManager.midiSequencesWithVel[snareMidiKey], inf)
      );
    });
  }

  updatePropQuant {
    arg quant;

    Pdefn('EminatorKick').quant = quant;
    Pdefn('EminatorSnare').quant = quant;
  }
}
