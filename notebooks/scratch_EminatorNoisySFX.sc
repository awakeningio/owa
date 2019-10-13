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
    TempoClock.default.tempo = 140.0 / 60.0;
    ~bufManager = BufferManager.new((
      rootDir: ~projectDir +/+ "sounds"
    ));
    ~bufManager.load_sample_providers_from_metadata(
      EminatorWubBuzzInstrument.getSampleProviderMetadatasToLoadList()
    );
  });
  
  s.boot();


)
(
  var wubBuzzSampleProvider = ~bufManager.getSampleProvider('wub-buzz-slices');
  var patch = Patch("owa.eminator.WubBuzzSampler", (
      gate: KrNumberEditor(1.0, \gate),
      amp: KrNumberEditor(-18.0.dbamp(), \amp),
      startTimes: wubBuzzSampleProvider.startTimesBuf.bufnum,
      sample: wubBuzzSampleProvider.sample.bufnum
    ));
    patch.gate.lag = 0;
    ~synthdef = patch.asSynthDef().add();
)

(
  Pdefn(
    'WubBuzzRhythm',
    Pseq([0.5].stutter(14) ++ [Rest(7.0)], inf)
  );
  Pdefn('WubBuzzIndex', Pseq((0..25), inf));
)
(
  Pdefn(
    'WubBuzzRhythm',
    Pseq([0.25].stutter(14) ++ [0.5].stutter(7) ++ [Rest(7.0)], inf)
  );
  Pdefn('WubBuzzIndex', Prand((0..25), inf));
)
(
  Pdefn(
    'WubBuzzRhythm',
    Pwrand(
      [
        Pseq([0.25, 0.25, Rest(0.5)]),
        Pseq([0.5, Rest(0.5)]),
        Pseq([1.0]),
        Pseq([2.0]),
        Pseq([Rest(1.0)])
      ],
      [
        3,
        3,
        2,
        1,
        1
      ].normalizeSum(),
      inf
    )
  );
  Pdefn('WubBuzzIndex', Prand((0..25), inf));
)
(


    ~pattern = Pbind(
      \instrument, ~synthdef.name,
      \dur, Pdefn('WubBuzzRhythm'),
      \index, Pdefn('WubBuzzIndex'),
      //\amp, -10.0.dbamp()
    );
    ~player = ~pattern.play();
)
(
)

(
  ~player.stop();
)
