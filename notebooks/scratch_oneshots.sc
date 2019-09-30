(

  MIDIClient.init;
  MIDIIn.connectAll;
  API.mountDuplexOSC();
  s.options.inDevice = "JackRouter";
  s.options.outDevice = "JackRouter";
  s.options.memSize = 8192 * 2 * 2 * 2;
  s.options.numOutputBusChannels = 48;
  s.options.numInputBusChannels = 48;
  //s.options.blockSize = 128;
  s.meter();
  s.plotTree();
  //s.dumpOSC();


  s.boot();
)

(
  ~clock = LinkClock.new(140.0 / 60.0);
  ~clock.play({
    ~clock.beatsPerBar = 7
  }, 4);
  ~clock
)

(
  var soundsDir = "/Users/colin/Projects/owa/sounds";
  ~bufManager = BufferManager.new((
    rootDir: soundsDir
  ));
)
(

  ~bufManager.cue_bufs([
    (
      relativeFilePath: "eerie_idle_loop_mono_adjusted.wav",
      bufferKey: 'eerie_idle_loop',
      numChannels: 1
    ),
    (
      relativeFilePath: "eerie_exit_15bars [2018-07-08 173939]_mono.wav",
      bufferKey: 'spinny-pluck_idle-L6',
      numChannels: 1
    ),
    (
      relativeFilePath: "spinny-pluck_L6-L4_mono.wav",
      bufferKey: 'spinny-pluck_L6-L4',
      numChannels: 1
    ),
    (
      relativeFilePath: "spinny-pluck_L4-L2_5bar [2018-08-03 180721]_mono.wav",
      bufferKey: 'spinny-pluck_L4-L2',
      numChannels: 1
    ),
    (
      relativeFilePath: "spinny-pluck_L2-reveal_mono.wav",
      bufferKey: 'spinny-pluck_L2-reveal',
      numChannels: 1
    ),
    (
      relativeFilePath: "spinny-pluck_reveal-55bar_mono.wav",
      bufferKey: 'spinny-pluck_reveal',
      numChannels: 1
    ),
    (
      relativeFilePath: "eminator_trans_L2-Reveal_mono.wav",
      bufferKey: \eminator_trans_L2_reveal,
      numChannels: 1
    ),
    (
      relativeFilePath: "eminator_trans_L4-L2_mono.wav",
      bufferKey: \eminator_trans_L4_L2,
      numChannels: 1
    ),
    (
      relativeFilePath: "eminator_trans_L6-L4_mono.wav",
      bufferKey: \eminator_trans_L6_L4,
      numChannels: 1
    ),
    (
      relativeFilePath: "eminator_trans_idle_mono.wav",
      bufferKey: \eminator_trans_idle,
      numChannels: 1
    ),
    (
      relativeFilePath: "eminator_reveal_mono.wav",
      bufferKey: \eminator_reveal,
      numChannels: 1
    )
  ]);
)

(

  ~synthdef = Patch("cs.sfx.StreamBuf", (
    buf: ~bufManager.bufs['eminator_trans_L6_L4'],
    gate: KrNumberEditor(1, \gate),
    attackTime: KrNumberEditor(0.0, [0.0, 200.0]),
    releaseTime: KrNumberEditor(0.0, [0.0, 20.0]),
    amp: KrNumberEditor(1.0, \amp),
    isSustained: 1,
    convertToStereo: 1,
  )).asSynthDef().add();
)

(
  ~pat = Pbind(
      \attackTime, 0.0,
      \releaseTime, 0.0,
      \amp, 1.0,
      \instrument, ~synthdef.name,
      \midinote, Pseq(["C3".notemidi()]),
      \dur, Pseq([8 * 4]),
      \legato, 1.0
    );
)

(

  ~bufManager.recue_buf('eminator_trans_L6_L4');
)

(
  ~pat.play();
)


(
  ~patch = Patch("owa.EminatorIdle", (
    gate: KrNumberEditor(0, \gate),
    attackTime: 4.0,
    releaseTime: 1 * ~clock.tempo,
    transitionGate: KrNumberEditor(0, \gate),
    transitionDuration: 7 * 4 * ~clock.tempo
  ));
  ~patch.gate.value = 1;
  ~player = ~patch.play();
);

(
  ~player.gate.value = 0;
)

~player.gate.value.class

(
  ~player.stop();
)

~player.transitionGate.value = 1;
~player.transitionGate.value = 0;

Env.perc(attackTime: 10, releaseTime: 0, curve: 4).range(50, 90).plot()


~something.isNil().not()
