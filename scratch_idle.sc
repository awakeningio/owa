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
  var clock = TempoClock.default;
  ~patch = Patch("owa.EminatorIdle", (
    gate: KrNumberEditor(0, \gate),
    attackTime: 1.0,
    releaseTime: 16.0 * clock.tempo,
    amp: -3.0.dbamp(),
    transitionGate: 0,
    transitionDuration: 0
  ));
)

(
  ~patch.gate.value = 1;
  ~player = ~patch.play();
)

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
