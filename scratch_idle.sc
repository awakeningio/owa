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
  ~player = Patch("owa.EminatorIdle", (
    gate: KrNumberEditor(1, \gate),
    attackTime: 4.0,
    releaseTime: 1 * ~clock.tempo,
    transitionGate: KrNumberEditor(0, \gate),
    transitionDuration: 7 * 4 * ~clock.tempo
  )).play(atTime: 7, bus: 46);
);

(
  ~player.gate.value = 0;
)

~player.transitionGate.value = 1;

Env.perc(attackTime: 10, releaseTime: 0, curve: 4).range(50, 90).plot()
