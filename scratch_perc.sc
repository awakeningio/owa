({
  var bufManager,
    soundsDir,
    percussionKitSampleManager,
    onPercussionLoaded;

  onPercussionLoaded = {
    var acousticKickSamplerManager,
      acousticSnareSampleManager,
      electronicSnareSampleManager,
      pat,
      synthdef,
      snareSynthDef,
      hatSynthDef,
      clock = TempoClock.default();
    acousticKickSamplerManager = percussionKitSampleManager.getVoiceSampleManager('acoustic_kick');
    electronicSnareSampleManager = percussionKitSampleManager.getVoiceSampleManager('electronic_snare');
    acousticSnareSampleManager = percussionKitSampleManager.getVoiceSampleManager('acoustic_snare');

    synthdef = Patch("owa.EminatorKick", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(1.0, \amp),
      acousticStartTimesBufnum: acousticKickSamplerManager.startTimesBuf.bufnum
    )).asSynthDef().add();

    snareSynthDef = Patch("owa.EminatorSnare", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(1.0, \amp),
      electronicStartTimesBufnum: electronicSnareSampleManager.startTimesBuf.bufnum,
      acousticStartTimesBufnum: acousticSnareSampleManager.startTimesBuf.bufnum
    )).asSynthDef().add();

    hatSynthDef = Patch("owa.EminatorHiHat", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(1.0, \amp),
      openHat: KrNumberEditor(0, [0, 1]),
      sustainTime: KrNumberEditor(1, [0, 100]),
      acousticClosedStartTimes: percussionKitSampleManager.getVoiceSampleManager('acoustic_hat').startTimesBuf.bufnum,
      acousticOpenStartTimes: percussionKitSampleManager.getVoiceSampleManager('acoustic_hat_open').startTimesBuf.bufnum,
      electronicClosedStartTimes: percussionKitSampleManager.getVoiceSampleManager('electronic_hat').startTimesBuf.bufnum,
      electronicOpenStartTimes: percussionKitSampleManager.getVoiceSampleManager('electronic_hat_open').startTimesBuf.bufnum,
      sustained: false
    )).asSynthDef().add();

    //pat = Pbind(
      //\velocity, Pseq([10, 0, 100, 0, 50, 0, 127, 0], inf),
      //\dur, Pseq([0.5, 0.5], inf),
      //\midinote, Pseq(["D0".notemidi(), \rest], inf),
      //\acousticStartTimesBufnum, acousticKickSamplerManager.sampleBufnumPattern(),
      //\instrument, synthdef.name,
      ////\echo, Pfunc({
        ////arg e;
        ////"e['velocity']:".postln;
        ////e['velocity'].postln;
      ////})
    //);

    //pat = Pbind(
      //\velocity, Pseq([10, 0, 100, 0, 50, 0, 127, 0], inf),
      //\dur, Pseq([0.5, 0.5], inf),
      //\midinote, Pseq(["D0".notemidi(), \rest], inf),
      //\instrument, snareSynthDef.name,
      //\electronicSampleBufnum, electronicSnareSampleManager.sampleBufnumPattern(),
      //\acousticSampleBufnum, acousticSnareSampleManager.sampleBufnumPattern()
    //);
    pat = Pbind(
      \instrument, hatSynthDef.name,
      \velocity, Pseq([10, 0, 100, 0, 50, 0, 127, 0, 10, 10, 0, 100, 100, 0, 50, 50, 0, 127, 127, 0], inf),
      \dur, Pseq([0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.3, 0.2, 0.5, 0.3, 0.2, 0.5, 0.3, 0.2, 0.5, 0.3, 0.2], inf),
      \midinote, Pseq([22, \rest, 22, \rest, 22, \rest, 22, \rest, 25, 22, \rest, 25, 22, \rest, 25, 22, \rest, 25, 22, \rest], inf),
      \openHat, Pfunc({
        arg e;

        if (e[\midinote] == 25, {
          1    
        }, {
          0
        });
      }),
      \sustainTime, Pfunc({
        arg e;
        (e[\dur] / clock.tempo);
      }),
      \acousticClosedSample, percussionKitSampleManager.getVoiceSampleManager('acoustic_hat').sampleBufnumPattern(),
      \electronicClosedSample, percussionKitSampleManager.getVoiceSampleManager('electronic_hat').sampleBufnumPattern(),
      \acousticOpenSample, percussionKitSampleManager.getVoiceSampleManager('acoustic_hat_open').sampleBufnumPattern(),
      \electronicOpenSample, percussionKitSampleManager.getVoiceSampleManager('electronic_hat_open').sampleBufnumPattern()
    );
    pat.play();
  };



  s.doWhenBooted({
    soundsDir = "/Users/colin/Projects/owa/sounds";
    bufManager = BufferManager.new((
      rootDir: soundsDir
    ));

    //acousticKickSamplerManager = PercussionVoiceSampleManager.new((
      //bufManager: bufManager,
      //metadataFilePath: soundsDir +/+ "acoustic_kick_sampled.json",
      //onDoneLoading: acousticKickDone
    //));

    //syntheticSnareSampleManager = PercussionVoiceSampleManager.new((
      //bufManager: bufManager,
      //metadataFilePath: soundsDir +/+ "electronic_snare.json",
      //onDoneLoading: syntheticSnareDone
    //));

    //acousticSnareSampleManager = PercussionVoiceSampleManager.new((
      //bufManager: bufManager,
      //metadataFilePath: soundsDir +/+ "acoustic_snare.json",
      //onDoneLoading: acousticSnareDone
    //));

    percussionKitSampleManager = OWAPercussionKitSampleManager.new((
      bufManager: bufManager,
      soundsDir: soundsDir,
      onDoneLoading: onPercussionLoaded
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
