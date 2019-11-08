Instr("owa.eminator.Bass", {
  arg freq = 440,
    gate = 1,
    freqlag = 0,
    pb = 1.0,
    amp = 0.9,
    // attack resonance
    attackModFreq = 100,
    toneModulatorGainMultiplier = 0.0,
    toneModulatorLFOAmount = 0.0,
    toneModulatorLFORate = 0.0,
    useSustain = 0,
    sustainTime = 0,
    useModulatorBus = 0,
    toneModulatorGainMultiplierBus,
    toneModulatorLFOAmountBus;

  var out;

  out = Instr.ar("cs.fm.WideBass", (
    freq: freq,
    gate: gate,
    freqlag: freqlag,
    pb: pb,
    amp: amp,
    attackModFreq: attackModFreq,
    toneModulatorGainMultiplier: toneModulatorGainMultiplier,
    toneModulatorLFOAmount: toneModulatorLFOAmount,
    toneModulatorLFORate: toneModulatorLFORate,
    useSustain: useSustain,
    sustainTime: sustainTime,
    useModulatorBus: useModulatorBus,
    toneModulatorGainMultiplierBus: toneModulatorGainMultiplierBus,
    toneModulatorLFOAmountBus: toneModulatorLFOAmountBus
  ));

  out = MidEQ.ar(out, 935, 1.0, -9.0);
  out = MidEQ.ar(out, 140, 1.5, 6.0);
  out = MidEQ.ar(out, 70, 1.8, -12);

  out = -14.0.dbamp() * out;
  //out = out + Resonz.ar(out, 140, 1.05, 6.0.dbamp());

  [out, out];
}, [
  \freq,
  \gate,
  [0, 2],
  [1.0 / 4.0, 4.0],
  \amp,
  // attackModFreq
  \freq,
  // toneModulatorGainMultiplier
  [0.1, 20.0],
  // tone modulator LFO amount
  [0, 50.0],
  // tone modulator LFO rate
  \beats,
  // useSustain
  StaticIntegerSpec(0, 1),
  // sustainTime
  [0, 10],
  // useModulatorBus
  StaticIntegerSpec(0, 1),
  // toneModulatorGainMultiplierBus
  \controlbus,
  // toneModulatorLFOAmountBus
  \controlbus
]);
