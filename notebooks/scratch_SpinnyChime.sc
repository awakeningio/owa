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
    ~bufManager.load_bufs(
      SpinnyChimeInstrument.getBufsToLoadList()
    );
  });
  
  s.boot();

)

(
  var bufManager = ~bufManager,
    patch,
    synthdef,
    pattern,
    originalFreq = "D3".notemidi().midicps();

  patch = Patch("owa.PitchedSampler", (
    originalFreq: originalFreq,
    bufnum: bufManager.bufs[\chime_ring_d].bufnum,
    amp: -20.dbamp(),
    releaseTime: 5.0,
    gate: KrNumberEditor(1, \gate),
    attackTime: 0.3
  ));
  patch.gate.lag = 0;
  synthdef = patch.asSynthDef().add();

  pattern = Ppar([
    Pbind(
      \instrument, synthdef.name,
      \scale, Scale.minor,
      \root, 2,
      \octave, 4,
      [\degree, \dur], Pdefn('SpinnyChimeOne'),
      //\reversed, Pseq([
        //0
      //], inf),
    ),
    Pbind(
      \instrument, synthdef.name,
      \scale, Scale.minor,
      \root, 2,
      \octave, 4,
      [\degree, \dur], Pdefn('SpinnyChimeTwo'),
      //\reversed, Pseq([
        //1
      //], inf),
    )
  ]);
  ~pattern = pattern;
)

(
  Pdefn('SpinnyChimeOne', Ptuple([
    Pseq([
      \rest,  1,   \rest
    ], inf),
    Pseq([
      7,      0.5,  0.5
    ], inf),
  ]));
  Pdefn('SpinnyChimeTwo', Ptuple([
    Pseq([
      \rest,  4,  \rest,
    ], inf),
    Pseq([
      1,      6,  1
    ], inf),
  ]));
)
(
  Pdefn('SpinnyChimeOne', Ptuple([
    Pseq([
      \rest,  1,   \rest, 6, 3
    ].scramble, inf),
    Pseq([
      7,      0.5,  0.5, 3, 3, 2
    ].scramble, inf),
  ]));
  Pdefn('SpinnyChimeTwo', Ptuple([
    Pseq([
      \rest,  4,  \rest, 3, 1
    ].scramble, inf),
    Pseq([
      1,      3, 3,  1, 6, 2
    ].scramble, inf),
  ]));
)

~pattern.play();
