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
    ~bufManager.load_bufs(
      EminatorSharpEerieInstrument.getBufsToLoadList()
    );
  });
  
  s.boot();


)

