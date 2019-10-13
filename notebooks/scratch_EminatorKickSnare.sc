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
      EminatorKickSnareInstrument.getSampleProviderMetadatasToLoadList()
    );
  });
  
  s.boot();
)

(
  var bufManager = ~bufManager,
    acousticKickSampleProvider,
    electSnareSampleProvider,
    acoustSnareSampleProvider,
    kickPatch,
    snarePatch,
    snareSynthDef,
    kickSynthDef,
    pattern;

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
    snarePatch.gate.lag = 0;
    snarePatch.velocity.lag = 0;
    snareSynthDef = snarePatch.asSynthDef().add();

    kickPatch = Patch("owa.EminatorKick", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-0.0.dbamp(), \amp),
      acousticStartTimesBufnum: acousticKickSampleProvider.startTimesBuf.bufnum
    ));
    kickPatch.gate.lag = 0;
    kickPatch.velocity.lag = 0;
    kickSynthDef = kickPatch.asSynthDef().add();

    pattern = Ppar([
      Pbind(
        \instrument, snareSynthDef.name,
        [\dur, \velocity], Pdefn('EminatorSnare'),
        \midinote, "D1".notemidi(),
        //[\midinote, \dur], Pdefn('EminatorSnareNotes'),
        //\velocity, Pseq([110], inf),
        \electronicSampleBufnum, electSnareSampleProvider.sampleBufnumPattern(),
        \acousticSampleBufnum, acoustSnareSampleProvider.sampleBufnumPattern(),
        \test, Pfunc({
          arg e;
          "e['velocity']:".postln;
          e['velocity'].postln;
          0.0;
        })
      ),
      Pbind(
        \instrument, kickSynthDef.name,
        //\velocity, Pseq([110], inf),
        //[\midinoteFromFile, \dur], Pdefn('EminatorKickNotes'),
        [\dur, \velocity], Pdefn('EminatorKick'),
        \midinote, "D0".notemidi(),
        //\midinote, Pfunc({
          //arg e;
          ////"e['midinoteFromFile']:".postln;
          ////e['midinoteFromFile'].postln;
          //"D0".notemidi();
        //}),
        \acousticSampleBufnum, acousticKickSampleProvider.sampleBufnumPattern(),
      )
    ]);

    ~pattern = pattern;
)

(
  // test
  Pdefn('EminatorKick', 
    Ptuple([
      Pseq([1, Rest(1), 1, Rest(1), 1, 1, 1], inf),
      Pseq(50 + ((1..7)*10), inf),
    ])
  );
  Pdefn('EminatorSnare', 
    Ptuple([
      Pseq([1, Rest(1), 1, Rest(1), 1, 1, 1], inf),
      Pseq(50 + ((1..7)*10), inf),
    ])
  );
)

(
  // variation 1
  Pdefn('EminatorKick', 
    Ptuple([
      // kick dur
      Pseq([1, Rest(2), 1, 1, Rest(1), 1], inf),
      // kick vel
      Pmeanrand(50, 80, inf),
    ])
  );

  Pdefn('EminatorSnare', 
    Ptuple([
      // snare dur
      Pseq([Rest(1), 1, Rest(5)], inf),
      // snare vel
      Pmeanrand(50, 80, inf),
    ])
  );
)

(
  // variation 2
  Pdefn('EminatorKick', 
    Ptuple([
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
)

(
  // variation 3
  Pdefn('EminatorKick', 
    Ptuple([
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
        // snare dur
        Pseq([Rest(2.5), 1, 1, Rest(2), 1/2]),
        // snare vel
        Pseq([0] ++ Env.new([100, 20]).asSignal(4))
      ]),
      Ptuple([
        // snare dur
        Pseq([Rest(4.5), 1, 1, 1/2]),
        // snare vel
        Pseq([0] ++ Env.new([100, 20]).asSignal(3))
      ]),
      Ptuple([
        // snare dur
        Pseq([Rest(4)] ++ [1/2].stutter(6)),
        // snare vel
        Pseq([0] ++ Env.new([100, 20]).asSignal(6))
      ]),
      Ptuple([
        // snare dur
        Pseq([Rest(4)] ++ [1/4].stutter(3) ++ [Rest(1/4), Rest(2)]),
        // snare vel
        Pseq([0] ++ Env.new([100, 20]).asSignal(3))
      ]),
    ], [2, 2, 1, 1].normalizeSum(), inf)
  );
)

50 + ((1..7)*10)
[Rest(4)] ++ [1/2].stutter(6)
[0] ++ Env.new([100, 20]).asSignal(5)
~player = ~pattern.play()
~player.stop()

