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
  });
  
  s.boot();

)

(
  var pat,
    patch,
    synthdef,
    clock = TempoClock.default;


  patch = Patch("cs.fm.WideBass", (
    amp: -24.dbamp(),
    gate: KrNumberEditor(1, \gate),
    useSustain: 0
  ));
  patch.gate.lag = 0;
  synthdef = patch.asSynthDef().add();

  pat = PmonoArtic(
    synthdef.name,
    \scale, Scale.minor,
    \root, 2,
    //\degree, Pseq([1], inf),
    //\octave, Pseq([4], inf),
    //\dur, Pseq([1, Rest(3)], inf),
    [\degree, \octave, \dur, \toneModulatorGainMultiplier, \toneModulatorLFOAmount], Pdefn('SpinnyBass'),
    \legato, 0.99,
    //\sustain, 3.5,
    //\sustainTime, Pfunc({
      //arg event;
      //(event[\sustain] / clock.tempo);
    //}),
    \attackModFreq, "D4".notemidi().midicps(),
    //\attackModFreq, Pfunc({
      //arg e;
      //(e[\note] + 12).midicps()
    //}),
    \toneModulatorLFORate, clock.tempo / 4.0,
    //\sendGate, true
  );

  ~pattern = pat;
)

(
  Pdefn('SpinnyBass', Ptuple([
    Pseq([0, 1], inf),
    Pseq([1, 1], inf),
    Pseq([4], inf),
    Pseq([1.0], inf),
    Pseq([2.0], inf)
  ]));
)
(
  Pdefn('SpinnyBass', Ptuple([
    Pseq([0, 1], inf),
    Pseq([1, 2], inf),
    Pseq([4, Rest(2), 1, 1], inf),
    Pseq([1.0], inf),
    Pseq([2.0], inf)
  ]));
)
(
  Pdefn('SpinnyBass', Ptuple([
    Prand([0, 1, 3, 3], inf),
    Pseq([1, 1, 2, 3], inf),
    Prand([
      Pseq([Rest(0.5), 0.5, 0.5, Rest(1), 0.5, 0.5, Rest(2.5), 1, 1]),
      Pseq([1, 1, Rest(2), 1, Rest(0.5), 1, 1, Rest(0.5)])
    ], inf),
    Pseq([1.0, 1.5, 3.0], inf),
    Pseq([2.0, 4.0, 8.0], inf)
  ]));
)


~pattern.play();
