SpinnyHatsInstrument {
  var bufManager,
    <patch,
    <pattern,
    clock,
    openSampleProvider,
    closedSampleProvider,
    o = 25,
    c = 22;
  *new {
    arg params;
    ^super.new().init(params);
  }
  *getSampleProviderMetadatasToLoadList {
    ^[
      'distorted_hat_closed',
      'distorted_hat_open'
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
        midiFileName: "spinny-pluck_L2_hats.mid",
        midiKey: 'spinny-pluck_L2_hats',
        makeDuration: 8 * 4,
        tempoBPM: OWAConstants.tempoBySongId['spinny_pluck']
      )
    ];
  }
  init {
    arg params;
    var synthdef,
      openSampleProvider,
      closedSampleProvider;

    bufManager = params['bufManager'];
    clock = params['clockController'].clock;

    openSampleProvider = bufManager.getSampleProvider('distorted_hat_open');
    closedSampleProvider = bufManager.getSampleProvider('distorted_hat_closed');

    patch = Patch("owa.spinny.SpinnyHiHat", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-6.0.dbamp(), \amp),
      openHat: KrNumberEditor(0, [0, 1]),
      sustainTime: KrNumberEditor(1, [0, 100]),
      sustained: false,
      closedStartTimes: closedSampleProvider.startTimesBuf.bufnum,
      openStartTimes: openSampleProvider.startTimesBuf.bufnum
    ));
    patch.gate.lag = 0;
    synthdef = patch.asSynthDef().add();

    pattern = Pbind(
      \instrument, synthdef.name,
      [\note, \dur, \velocity], Pdefn('SpinnyHats'),
      \openHat, Pfunc({
        arg e;
        if (e[\note] == o, {
          1
        }, {
          0
        });
      }),
      \sustainTime, Pfunc({
        arg e;
        (e[\dur] / clock.tempo);
      }),
      \closedSample, closedSampleProvider.sampleBufnumPattern(),
      \openSample, openSampleProvider.sampleBufnumPattern()
    );
  }
  updatePropQuant {
    arg quant;
    Pdefn('SpinnyHats').quant = quant;
  }
  updateForSessionPhase {
    arg sessionPhase;
    switch(sessionPhase,
      \TRANS_6, {
        this.useLevel6Variation(0);
      },
      \TRANS_2, {
        Pdefn(
          'SpinnyHats',
          Pseq(bufManager.midiSequencesWithVel['spinny-pluck_L2_hats'], inf)
        );
      }
    );
  }
  useLevel6Variation {
    arg variationIndex;

    switch(variationIndex,
      0, {
        Pdefn('SpinnyHats', Prand([
          Ptuple([
            Pseq([
              // 1.1 - 1.4
              c, c, c,    o,    c,  0,
              // 2.1 - 2.4
              c, o, c, o, c,
              // 3.1 - 3.4
              c, c, c, o, c, c,
              // 4.1 - 4.4
              c, c, o, c, c, c, c, o, c,
            ]),
            Pseq([
              // 1.1 - 1.4
              1, 3/4, 1/4, 1/2, 1/2, Rest(1),
              // 2.1 - 2.4
              1, 1, 1/2, 1/2, 1,
              // 3.1 - 3.4
              1, 3/4, 1/4, 1/4, 3/4, 1,
              // 4.1 - 4.4
              3/4, 1/4, 1, 3/4, 2/4, 2/4, 1/4,
            ]),
            Pmeanrand(80, 90, inf)
          ]),
          Ptuple([
            Pseq([
              // 5.1 - 5.4
              c, c, c, o, c, c,
              // 6.1 - 6.4
              0, c, o, c, o, c,
              // 7.1 - 7.4
              c, c, c, o, c,
              // 8.1 - 8.4
              c, o, c, o
            ]),
            Pseq([
              // 5.1 - 5.4
              1, 2/4, 2/4, 1, 3/4, 1/4,
              // 6.1 - 6.4
              Rest(1/4), 3/4, 1, 2/4, 1/4, 5/4,
              // 7.1 - 7.4
              1, 1/2, 1/2, 1, 1,
              // 8.1 - 8.4
              1/2, 1/2, 1, 2
            ]),
            Pmeanrand(80, 90, inf)
          ])
        ], inf));
      },
      1, {
        
        Pdefn('SpinnyHats', Prand([
          Ptuple([
            Pseq([
              // 1.1 - 1.4
              0, c, c, c,    o,    c,  0,
              // 2.1 - 2.4
              c, o, c, 0, c, o, c, c, c,
              // 3.1 - 3.4
              c, c, c, o, c, c,
              // 4.1 - 4.4
              c, c, o, c, c, c, c, c, c, Pseq([c], 16), c,
            ]),
            Pseq([
              // 1.1 - 1.4
              Rest(1/2), 1, 3/4, 1/4, 1/2, 1/2, Rest(1/2),
              // 2.1 - 2.4
              1, 1/3, 1/3, Rest(1/3), 1/2, 1/2, 1/3, 1/3, 1/3,
              // 3.1 - 3.4
              1, 3/4, 1/4, 1/4, 3/4, 1,
              // 4.1 - 4.4
              3/4, 1/4, 1/3, 1/3, 1/3, 3/4, Pseq([1/16], 16), 1/4,
            ]),
            Pmeanrand(90, 100, inf)
          ]),
          Ptuple([
            Pseq([
              // 1.1 - 1.4
              c, c, c,    o,    c,  c, 0,
              // 2.1 - 2.4
              c, o, c, 0, Pseq([c], 8), c, c, c,
              // 3.1 - 3.4
              c, c, c, o, c, c,
              // 4.1 - 4.4
              c, c, o, c, c, c, c, c, c, Pseq([c], 16), c,
            ]),
            Pseq([
              // 1.1 - 1.4
              1, 1/3, 1/3, 1/3, 1/2, 1/2, Rest(1),
              // 2.1 - 2.4
              1, 1/3, 1/3, Rest(1/3), Pseq([1/8], 8), 1/3, 1/3, 1/3,
              // 3.1 - 3.4
              1, 3/4, 1/4, 1/4, 3/4, 1,
              // 4.1 - 4.4
              3/4, 1/4, 1/3, 1/3, 1/3, 3/4, Pseq([1/16], 16), 1/4,
            ]),
            Pmeanrand(90, 100, inf)
          ]),
        ], inf));
      },
      2, {
        Pdefn('SpinnyHats', Prand([
          Ptuple([
            Pseq([
              // 1.1 - 1.4
              Pseq([c], 6), 0,
              // 2.1 - 2.4
              Pseq([c], 6), o, c, 0,
              // 3.1 - 3.4
              c, c, c, o, c, c,
              // 4.1 - 4.4
              c, c, o, c, c, c, c, c, c, Pseq([c], 16), c,
            ]),
            Pseq([
              // 1.1 - 1.4
              Pseq([1/3], 6), Rest(2),
              // 2.1 - 2.4
              Pseq([1/3], 6), 2/3, 2/3, Rest(2/3),
              // 3.1 - 3.4
              1, 3/4, 1/4, 1/4, 3/4, 1,
              // 4.1 - 4.4
              3/4, 1/4, 1/3, 1/3, 1/3, 3/4, Pseq([1/16], 16), 1/4,
            ]),
            Pmeanrand(90, 100, inf)
          ]),
          Ptuple([
            Pseq([
              // 1.1 - 1.4
              Pseq([c], 6), 0,
              // 2.1 - 2.4
              Pseq([c], 12), o, c, 0,
              // 3.1 - 3.4
              c, c, c, o, c, c,
              // 4.1 - 4.4
              c, c, o, c, c, c, c, c, Pseq([c], 16), c,
            ]),
            Pseq([
              // 1.1 - 1.4
              Pseq([1/3], 6), Rest(2),
              // 2.1 - 2.4
              Pseq([1/6], 12), 2/3, 2/3, Rest(2/3),
              // 3.1 - 3.4
              1, 3/4, 1/4, 1/4, 3/4, 1,
              // 4.1 - 4.4
              3/4, 1/4, 2/3, 1/3, 3/4, Pseq([1/16], 16), 1/4,
            ]),
            Pmeanrand(90, 100, inf)
          ]),
        ], inf));
      }
    );
  }
}
