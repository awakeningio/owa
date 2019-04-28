Instr("owa.SyntheticKick", {
  arg gate = 1,
    amp = 1.0,
    freq = 55,
    velocity,
    doneAction = Done.freeSelf;

  var carrier,
    attackModulator,
    toneModulator,
    out;

  attackModulator = Instr.ar("cs.fm.Oscillator", (
    amp: LinExp.kr(velocity, 0, 127, 25, 50) * freq,
    freq: 7.3 * freq,
    gate: gate,
    envShape: Env.new(
      [1.0,   0.0,    0.0 ],
      [   0.25,    0.75    ],
      [   -3.0,    0.00    ],
      releaseNode: nil
    ),
    envTimeScale: LinExp.kr(velocity, 127, 0, 0.5, 0.2),
    envDoneAction: Done.none
  ));

  toneModulator = Instr.ar("cs.fm.Oscillator", (
    amp: 40 * freq,
    freq: 0.5 * freq,
    gate: gate,
    envShape: Env.new(
      [0.0,     0.2,    0.0 ],
      [   0.05,      1.0    ],
      [   3.0,     -3.00    ],
      releaseNode: nil
    ),
    envTimeScale: 1,
    envDoneAction: Done.none
  ));

  carrier = Instr.ar("cs.fm.Oscillator", (
    amp: LinExp.kr(velocity, 0, 127, -6.dbamp(), 0.dbamp()) * amp,
    freq: freq + attackModulator + toneModulator,
    gate: gate,
    envShape: Env.new(
      //initial attack             peak          exp. decay
      [0.0,   1.0,      0.9,      0.9,      0.0 ],
      [   0.001,      0.05,      LinExp.kr(velocity, 0, 127, 0.4, 0.8),   1.5      ],
      [0.0,   2.5,     4.5,      -2.5,   -5.5  ],
      releaseNode: nil
    ),
    envDoneAction: doneAction
  ));
  out = amp * carrier;
  out;
}, [
  \gate,
  \amp,
  \freq,
  [0, 127]
]);
