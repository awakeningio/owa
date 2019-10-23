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
    pat;

    patch = Patch("cs.percussion.Impulsive", (
      makeStereo: 1
    ));
    synthdef = patch.asSynthDef().add();
    pat = Pbind(
      //\type, \instr,
      //\instr, "cs.percussion.Impulsive",
      \instrument, synthdef.name,
      [\midinote, \dur], Pdefn('SpinnyLeadPop'),
      \amp, 1.0.dbamp()
    );

    ~pattern = pat;
)

(
  Pdefn('SpinnyLeadPop', Ptuple([
    Pseq([
      Pseq(["F#6", "C0", "A6", "C0"].notemidi(), 5),
      Pseq(["F#6", "A6", "A6", "A6"].notemidi(), 3)
    ], inf),
    Pseq([
      Pseq([1/2, Rest(1/2)], 10),
      Pseq([1/2], 12)
    ], inf)
  ]));
)

~pattern.play();
~pattern.stop();
