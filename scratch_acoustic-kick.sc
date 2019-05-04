({
  var acousticKickSamplerManager,
    bufManager,
    soundsDir;

  var acousticKickDone = {
    var pat, synthdef;

    //synthdef = Patch("owa.AcousticKickSampler", (
      //velocity: KrNumberEditor(0, [0, 127]),
      //gate: KrNumberEditor(1, \gate),
      //amp: KrNumberEditor(1.0, \amp),
      //startTimesBufnum: acousticKickSamplerManager.startTimesBuf.bufnum
    //)).asSynthDef().add();

    synthdef = Patch("owa.EminatorKick", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(1.0, \amp),
      acousticStartTimesBufnum: acousticKickSamplerManager.startTimesBuf.bufnum
    )).asSynthDef().add();

    pat = Pbind(
      \velocity, Pseq([10, 0, 100, 0, 50, 0, 127, 0], inf),
      \dur, Pseq([0.5, 0.5], inf),
      \midinote, Pseq(["D0".notemidi(), \rest], inf),
      \acousticStartTimesBufnum, acousticKickSamplerManager.sampleBufnumPattern(),
      \instrument, synthdef.name,
      //\echo, Pfunc({
        //arg e;
        //"e['velocity']:".postln;
        //e['velocity'].postln;
      //})
    );

    pat.play();
  };

  s.doWhenBooted({
    soundsDir = "/Users/colin/Projects/owa/sounds";
    bufManager = BufferManager.new((
      rootDir: soundsDir
    ));

    acousticKickSamplerManager = AcousticKickSamplerManager.new((
      bufManager: bufManager,
      metadataFilePath: soundsDir +/+ "acoustic_kick_sampled.json",
      onDoneLoading: acousticKickDone
    ));


    s.meter();
    s.plotTree();
  });

  s.boot();
}).value();
//});

({
  
  //~env = Env.perc(0.005, 1.0, curve: 4.0);
  ~env = Env.new(
    //initial attack             peak          exp. decay
    [0.0,   1.0,      0.9,      0.9,      0.0 ],
    [   0.001,      0.05,      0.5,   1.5      ],
    [0.0,   2.5,     4.5,      -2.5,   -5.5  ],
    releaseNode: nil
  );
  ~env.plot();
});
//}).value();
