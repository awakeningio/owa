EminatorHatsInstrument {
  var bufManager, <patch, <pattern,
    acousticOpenProvider,
    acousticClosedProvider,
    electronicOpenProvider,
    electronicClosedProvider,
    clock;
  *new {
    arg params;
    ^super.new().init(params);
  }
  *getSampleProviderMetadatasToLoadList {
    ^[
      'acoustic_hat',
      'acoustic_hat_open',
      'electronic_hat',
      'electronic_hat_open'
    ].collect({
      arg voiceName;

      (
        name: voiceName,
        metadataFilePath: voiceName.asString() ++ ".json",
        class: PercussionVoiceSampleManager
      );
    });
  }
  *getMidiToLoadList {
    ^[
      (
        midiFileName: "eminator_L2_hats.mid",
        midiKey: 'eminator_hats_L2',
        makeDuration: 8 * 4,
        tempoBPM: OWAConstants.tempoBySongId['eminator']
      ),
      (
        midiFileName: "eminator_L4_hats.mid",
        midiKey: 'eminator_hats_L4',
        makeDuration: 8 * 4,
        tempoBPM: OWAConstants.tempoBySongId['eminator']
      )
    ];
  }
  init {
    arg params;
    var synthdef;

    bufManager = params['bufManager'];
    clock = params['clock'];

    acousticOpenProvider = bufManager.getSampleProvider('acoustic_hat_open');
    acousticClosedProvider = bufManager.getSampleProvider('acoustic_hat');
    electronicOpenProvider = bufManager.getSampleProvider('electronic_hat_open');
    electronicClosedProvider = bufManager.getSampleProvider('electronic_hat');

    patch = Patch("owa.EminatorHiHat", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-11.0.dbamp(), \amp),
      openHat: KrNumberEditor(0, [0, 1]),
      sustainTime: KrNumberEditor(1, [0, 100]),
      acousticClosedStartTimes: acousticClosedProvider.startTimesBuf.bufnum,
      acousticOpenStartTimes: acousticOpenProvider.startTimesBuf.bufnum,
      electronicClosedStartTimes: electronicClosedProvider.startTimesBuf.bufnum,
      electronicOpenStartTimes: electronicOpenProvider.startTimesBuf.bufnum,
      sustained: false
    ));
    patch.gate.lag = 0;
    synthdef = patch.asSynthDef().add();

    pattern = Pbind(
      \instrument, synthdef.name,
      [\note, \dur, \velocity], Pdefn('EminatorHats'),
      \openHat, Pfunc({
        arg e;

        if (e[\note] == 9, {
          1    
        }, {
          0
        });
      }),
      \sustainTime, Pfunc({
        arg e;
        (e[\dur] / clock.tempo);
      }),
      \acousticClosedSample, acousticClosedProvider.sampleBufnumPattern(),
      \electronicClosedSample, electronicClosedProvider.sampleBufnumPattern(),
      \acousticOpenSample, acousticOpenProvider.sampleBufnumPattern(),
      \electronicOpenSample, electronicOpenProvider.sampleBufnumPattern()
    );
  }

  useLevel6Variation {
    arg variationIndex;

    var o = 9,
      c = 10;

    switch(variationIndex,
      0, {
        // variation 1
        Pdefn(
          'EminatorHats',
          Ptuple([
            Pseq([
              0,          c,    o,    c,  0,
              c,  0,          c,  0,          o,  c,    0,
              c,  0,        0,          c,    o,  c,    c,  c,    0,
              c,  0,        c,    0,        o,    c,  0
            ], inf),
            Pseq([
              // 1.1 - 1.5
              Rest(1.75), 1/4,  3/4,  1/4, Rest(1),
              // 1.5 - 2.1
              1/4, Rest(3/4), 1/4, Rest(1/4), 2/4, 1/4, Rest(3/4),
              // 2.1 - 2.5
              1/4, Rest(3/4), Rest(3/4), 1/4, 1/4, 1/4, 1/4, 1/4, Rest(1),
              // 2.5 - 3.1
              1/4, Rest(3/4), 1/4, Rest(1/4), 2/4, 1/4, Rest(3/4)
            ], inf),
            Pmeanrand(75, 100, inf)
          ])
        );
      },
      1, {
        // variation 2
        Pdefn(
          'EminatorHats',
          Prand([
            Ptuple([
              Pseq([
                o, c, c, c,     0,        c,    0,        c,    o,    c,  0,
                c,  0,          c,  0,        o,    c,  0,
              ]),
              Pseq([
                // 1.1 - 1.5
                Pseq([1/4], 4), Rest(1/4), 1/4, Rest(1/4), 1/4, 1/4, 1/4, Rest(6/4),
                // 1.5 - 2.1
                1/4, Rest(3/4), 1/4, Rest(1/4), 2/4, 1/4, Rest(3/4)
                // 2.1 - 2.5
                // 2.5 - 3.1
              ]),
              Pmeanrand(75, 100, inf)
            ]),
            Ptuple([
              Pseq([
                o, c, c, c,     o,  c,    0,        c,  0,
                c,  0,          c,  0,        o,    c,  0,
              ]),
              Pseq([
                // 1.1 - 1.5
                Pseq([1/4], 4), 3/4, 1/4, Rest(2/4), 1/4, Rest(5/4),
                // 1.5 - 2.1
                1/4, Rest(3/4), 1/4, Rest(1/4), 2/4, 1/4, Rest(3/4)
                // 2.1 - 2.5
                // 2.5 - 3.1
              ]),
              Pmeanrand(75, 100, inf)
            ])
          ], inf)
        );
      },
      2, {
        // variation 3
        Pdefn(
          'EminatorHats',
          Prand([
            Ptuple([
              Pseq([
                c,  c, o, c, c, c, o, c, 0,
                o, c, o, o, c, c, c, o,   0,      o,  o
              ]),
              Pseq([
                // 1.1 - 2.1
                1, Pseq([1/2], 6), 1, Rest(1),
                Pseq([1/2], 8),           Rest(1), 1/4, 3/4
                // 1.5 - 2.1
                //1/4, Rest(3/4), 1/4, Rest(1/4), 2/4, 1/4, Rest(3/4)
                // 2.1 - 2.5
                // 2.5 - 3.1
              ]),
              Pmeanrand(75, 100, inf)
            ]),
            Ptuple([
              Pseq([
                c,  c, o, c, c, c, o, c, 0,
                o, c, o, o, c, c, c, o,   0,      c,  c,    o
              ]),
              Pseq([
                // 1.1 - 2.1
                1, Pseq([1/2], 6), 1, Rest(1),
                Pseq([1/2], 8),           Rest(1), 1/8, 1/8, 3/4
                // 1.5 - 2.1
                //1/4, Rest(3/4), 1/4, Rest(1/4), 2/4, 1/4, Rest(3/4)
                // 2.1 - 2.5
                // 2.5 - 3.1
              ]),
              Pmeanrand(75, 100, inf)
            ]),
            Ptuple([
              Pseq([
                c,  c, c, c, c, c, c, c, 0,
                o, c, o, o, c, c, c, o,   0,      c,  c,    o
              ]),
              Pseq([
                // 1.1 - 2.1
                1, Pseq([1/3], 6), 1, Rest(2),
                Pseq([1/2], 8),           Rest(1), 1/8, 1/8, 3/4
                // 1.5 - 2.1
                //1/4, Rest(3/4), 1/4, Rest(1/4), 2/4, 1/4, Rest(3/4)
                // 2.1 - 2.5
                // 2.5 - 3.1
              ]),
              Pmeanrand(75, 100, inf)
            ])
          ], inf)
        );
      }
    );
  }

  updateForSessionPhase {
    arg sessionPhase;
    var hatsMidiKey = nil;

    switch(sessionPhase,
    \QUEUE_TRANS_6, {
      this.useLevel6Variation(0);
    },
    \TRANS_4, {
      hatsMidiKey = 'eminator_hats_L4';
    },
    \TRANS_2, {
      hatsMidiKey = 'eminator_hats_L2';
    }
  );

  if (hatsMidiKey != nil, {
    Pdefn(
      'EminatorHats',
      Pseq(bufManager.midiSequencesWithVel[hatsMidiKey], inf)
    );
  });

  }
  updatePropQuant {
    arg quant;

    Pdefn('EminatorHats').quant = quant;
  }
}
