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

(
)

(
  ~sharp = EminatorSharpEerieInstrument.new((
    bufManager: ~bufManager
  ));
)

(
  ~sharp.handleSessionPhaseChanged('TRANS_6');
  ~player = ~sharp.pattern.play();
)

(
  ~sharp.useVariation(2)
)

(
  Pdefn(
    'EminatorSharpEerieNotes',
    Prand([
      Ptuple([
        Pseq([2, Rest(5)]),
        1.0
      ]),
      Ptuple([
        Pseq([Rest(7)]),
        1.0
      ])
    ], inf)
  );
)
(
  Pdefn(
    'EminatorSharpEerieNotes',
    Pwrand(
      [
        Ptuple([
          Pseq([1, 1, Rest(5)]),
          Prand([1.5, 2.0])
        ]),
        Ptuple([
          Pseq([1, Rest(1), 1, Rest(4)]),
          Prand([1.0, 2.0])
        ]),
        Ptuple([Pseq([2, Rest(5)]), 1.0]),
        Ptuple([Pseq([Rest(7)]), 1.0])
      ],
      [
        2,
        2,
        1,
        1
      ].normalizeSum(),
      inf
    )
  );
)
(
  Pdefn(
    'EminatorSharpEerieNotes',
    Pwrand(
      [
        Ptuple([
          Pseq([Rest(0.5), 0.5, Rest(0.5), 0.5, Rest(0.5), Rest(4.5)]),
          Pseq([1.0,      2.0,  1.0,      2.5,    1.0,    1.0])
        ]),
        Ptuple([
          Pseq([Rest(0.5), 1, Rest(1), 1, Rest(3.5)]),
          Pseq([1.0,      -2.0,2.0,    -2.0,1.0])
        ]),
        Ptuple([
          Pseq([Rest(0.5), 2, Rest(4.5)]),
          -1.0
        ]),
        Ptuple([
          Pseq([Rest(7)]),
          -1.0
        ]),
      ],
      [
        3,
        2,
        1,
        1
      ].normalizeSum(),
      inf
    )
  );
)
(
  Pdefn(
    'EminatorSharpEerieNotes',
    Pwrand(
      [
        Prand([
          Ptuple([
            Pseq([0.25, 0.25, Rest(0.25), 0.25]),
            Pseq([2.0,  -2.0,  1.0,  -2.0])
          ]),
          Ptuple([
            Pseq([0.25, 0.25, 0.25, 0.25]),
            Pseq([2.0,  2.5,  2.0,  -2.0])
          ]),
          Ptuple([
            Pseq([Rest(1)]),
            1
          ]),
        ], 7),
        Ptuple([
          Prand([
            Pseq([0.5, 1, Rest(1), 1]),
            Pseq([Rest(3.5)])
          ], 2),
          0.5
        ]),
        Ptuple([
          Pseq([0.5, 1, 1, Rest(4.5)]),
          -1.0
        ]),
        Ptuple([
          Pseq([0.5, 1, Rest(1), 1, Rest(3.5)]),
          -1.0
        ]),
        Ptuple([
          Pseq([0.5, 2, Rest(4.5)]),
          1.0
        ]),
        Ptuple([
          Pseq([Rest(7)]),
          1.0
        ]),
      ],
      [
        4,
        4,
        3,
        3,
        2,
        1
      ].normalizeSum(),
      inf
    )
  );
)

(
  ~player.stop();
)
