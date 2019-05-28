(
  s.doWhenBooted({
    var soundsDir = "/Users/colin/Projects/owa/sounds";
    ~bufManager = BufferManager.new((
      rootDir: soundsDir
    ));

    ~bufManager.load_midi([
      (
        midiFileName: "eminator_lead_L2.mid",
        midiKey: 'eminator_lead_L2',
        makeDuration: 4 * 16,
        tempoBPM: 140.0
      )
    ]);

    TempoClock.default.tempo = 140.0 / 60.0;

    ~sampleManager = OWASampleManager.new((
      bufManager: ~bufManager,
      soundsDir: soundsDir,
      onDoneLoading: ({
        "done".postln();
      })
    ));

    s.meter();
    s.plotTree();
  });
  MIDIClient.init;
  MIDIIn.connectAll;
  API.mountDuplexOSC();
  s.options.inDevice = "JackRouter";
  s.options.outDevice = "JackRouter";
  s.options.memSize = 8192 * 2 * 2 * 2;
  s.options.blockSize = 8;
  s.boot();
)

(
  var highPopSamplerManager = ~sampleManager.getVoiceSampleManager('high-pop'),
    synthdef;

    synthdef = Patch("owa.eminator.HighPop", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(1.0, \amp),
      startTimesByVelocity: highPopSamplerManager.startTimesBuf.bufnum,
    )).asSynthDef().add();

    ~player = Pbind(
      \instrument, synthdef.name,
      \midinote, Pseq([Pseq([\rest, "D5".notemidi()], 7), Pseq([\rest, "D4".notemidi()], 7)], inf),
      \dur, Pseq([1], inf),
      \velocity, Pseq([100], inf),
      [\sample, \samplemidinote, \sampleFreq], highPopSamplerManager.sampleAndSampleNotePattern(),
      \sendGate, false
    ).play();
)

(
  var leadSamplerManager = ~sampleManager.getVoiceSampleManager('lead'),
    synthdef;

  synthdef = Patch("owa.eminator.Lead", (
    velocity: KrNumberEditor(0, [0, 127]),
    gate: KrNumberEditor(1, \gate),
    amp: KrNumberEditor(1.0, \amp),
    startTimesByVelocity: leadSamplerManager.startTimesBuf.bufnum
  )).asSynthDef().add();

  ~player = Pbind(
    \instrument, synthdef.name,
    //\midinote, Pseq(["D4".notemidi(), \rest], inf),
    //\dur, 1,
    [\midinote, \dur], Pseq(~bufManager.midiSequences['eminator_lead_L2'], inf),
    \velocity, 100,
    [\sample, \samplemidinote, \sampleFreq], leadSamplerManager.sampleAndSampleNotePattern()
  ).play();
)

(
  ~player.stop();
)
