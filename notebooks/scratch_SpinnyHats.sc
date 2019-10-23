(
  ~projectDir = "/Users/colin/Projects/owa";

  MIDIClient.init;
  MIDIIn.connectAll;
  API.mountDuplexOSC();
  s.options.inDevice = "JackRouter";
  s.options.outDevice = "JackRouter";
  s.options.memSize = 8192 * 2 * 2 * 2;
  s.options.blockSize = 8;
  s.meter();
  s.plotTree();
  //s.dumpOSC();


  s.waitForBoot({
    TempoClock.default.tempo = 120.0 / 60.0;
    OWAConstants.init((
      constants: (
        'AUTO_TRANS_SESSION_PHASES': [],
        'SESSION_PHASES': [],
        'NEXT_SESSION_PHASES': [],
        'SONG_IDS': [],
        'SONG_IDS_LIST': [],
        'TEMPO_BY_SONGID': (
          'eminator': 140.0,
          'spinny_pluck': 120.0
        ),
        'SESSION_PHASE_BEATS_PER_BAR_BY_SONGID': Dictionary.new(),
        'SESSION_PHASE_DURATIONS_BY_SONGID': Dictionary.new()
      )
    ));
    ~bufManager = BufferManager.new((
      rootDir: ~projectDir +/+ "sounds"
    ));
    ~bufManager.load_sample_providers_from_metadata(
      SpinnyHatsInstrument.getSampleProviderMetadatasToLoadList()
    );
    ~bufManager.load_midi(
      SpinnyHatsInstrument.getMidiToLoadList()
    );
  });
  
  s.boot();

)

(
  var synthdef,
    clock = TempoClock.default,
    bufManager = ~bufManager,
    pattern,
    patch,
    openSampleProvider,
    closedSampleProvider,
    o = 25,
    c = 22;

  openSampleProvider = bufManager.getSampleProvider('distorted_hat_open');
  closedSampleProvider = bufManager.getSampleProvider('distorted_hat_closed');

  patch = Patch("owa.spinny.SpinnyHiHat", (
    velocity: KrNumberEditor(0, [0, 127]),
    gate: KrNumberEditor(1, \gate),
    amp: KrNumberEditor(-11.0.dbamp(), \amp),
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

  ~pattern = pattern;
)

(
  // level2
  var bufManager = ~bufManager;

  Pdefn(
    'SpinnyHats',
    Pseq(bufManager.midiSequencesWithVel['spinny-pluck_L2_hats'], inf)
  );
)

(
  // level 6 var 1
  var o = 25,
    c = 22;


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
)

~pattern.play();

