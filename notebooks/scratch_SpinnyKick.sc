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
      SpinnyKickInstrument.getSampleProviderMetadatasToLoadList()
    );
  });
  
  s.boot();

)

(
  var bufManager = ~bufManager,
    kickPatch,
    kickSynthDef,
    acousticKickSampleProvider,
    pattern;

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
      \midinote, "D0".notemidi(),
      \acousticSampleBufnum, acousticKickSampleProvider.sampleBufnumPattern(),
    );


    ~pattern = pattern;

)

(
  ~instr = SpinnyKickInstrument.new((
    bufManager: ~bufManager
  ));
)

(
  ~instr.useLevel6Variation(0);
)

(
  ~instr.pattern.play();
)

(
  var note = "D0".notemidi();

  Pdefn('SpinnyKick', Ptuple([
    Pseq([
      note, \rest, \rest, note, note, \rest, \rest, note
    ], inf),
    Pseq([1], inf),
    Pmeanrand(60, 80, inf)
  ]));
)
(
  var note = "D0".notemidi();

  Pdefn('SpinnyKick', Ptuple([
    Pseq([
      note, \rest, \rest, note, note, \rest, \rest, note
    ].scramble, inf),
    Pseq([1, 1, 1, 0.5, 0.5].scramble, inf),
    Pmeanrand(60, 80, inf)
  ]));
)


~pattern.play();
