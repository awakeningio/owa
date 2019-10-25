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
    ~bufManager = BufferManager.new((
      rootDir: ~projectDir +/+ "sounds"
    ));
  });
  
  s.boot();


)

(
  var patch,
    synthdef,
    pattern;

    patch = Patch("cs.percussion.Impulsive", (
      makeStereo: 1
    ));
    synthdef = patch.asSynthDef().add();
    pattern = Pbind(
      \instrument, synthdef.name,
      \scale, Scale.minor,
      \root, 2,
      \octave, 6,
      [\degree, \dur], Pdefn('SpinnyLeadPop'),
      \amp, 1.0.dbamp()
    );

    ~pattern = pattern;
)

(
  Pdefn('SpinnyLeadPop', Ptuple([
    Pseq([
      Pseq([3, 5], 5),
      Pseq([3, 5, 5, 5], 3)
    ], inf),
    Pseq([
      Pseq([1], 10),
      Pseq([1/2], 12)
    ], inf)
  ]));
)
(
  Pdefn('SpinnyLeadPop', Ptuple([
    Pseq(
      [3, 5, 7, 2]
    , inf),
    Pseq([
      1, 1/2, 1/2, 1
    ], inf)
  ]));
)
(
  Pdefn('SpinnyLeadPop', Ptuple([
    Pseq(
      [3, 5, 7, 2,    Pseq([3, 5], 6)]
    , inf),
    Pseq([
      1/3, 1/3, 1/3, 1, Pseq([1/2], 12)
    ], inf)
  ]));
)

~player = ~pattern.play();
~player.stop();
