SpinnyBassInstrument {
  var <patch, <pattern, clock;
  *new {
    arg params;
    ^super.new().init(params);
  }
  init {
    arg params;
    var synthdef,
      originalFreq = "D3".notemidi().midicps();

    clock = params['clock'];

    patch = Patch("cs.fm.WideBass", (
      amp: -28.dbamp(),
      gate: KrNumberEditor(1, \gate),
      useSustain: 0
    ));
    patch.gate.lag = 0;
    synthdef = patch.asSynthDef().add();

    pattern = PmonoArtic(
      synthdef.name,
      \scale, Scale.minor,
      \root, 2,
      //\degree, Pseq([1], inf),
      //\octave, Pseq([4], inf),
      //\dur, Pseq([1, Rest(3)], inf),
      [\degree, \octave, \dur, \toneModulatorGainMultiplier, \toneModulatorLFOAmount], Pdefn('SpinnyBass'),
      \legato, 0.99,
      //\sustain, 3.5,
      //\sustainTime, Pfunc({
        //arg event;
        //(event[\sustain] / clock.tempo);
      //}),
      \attackModFreq, "D4".notemidi().midicps(),
      //\attackModFreq, Pfunc({
        //arg e;
        //(e[\note] + 12).midicps()
      //}),
      \toneModulatorLFORate, clock.tempo / 4.0,
      //\sendGate, true
    );
    
  }
  updatePropQuant {
    arg quant;
    Pdefn('SpinnyBass').quant = quant;
  }
  updateForSessionPhase {
    arg sessionPhase;
    switch(sessionPhase,
      \TRANS_6, {
        this.useLevel6Variation(0);
      }
    );
  }
  useLevel6Variation {
    arg variationIndex;

    switch(variationIndex,
      0, {
        Pdefn('SpinnyBass', Ptuple([
          Pseq([0, 1], inf),
          Pseq([1, 1], inf),
          Pseq([4], inf),
          Pseq([1.5], inf),
          Pseq([2.0], inf)
        ]));
      },
      1, {
        Pdefn('SpinnyBass', Ptuple([
          Pseq([0, 1], inf),
          Pseq([1, 2], inf),
          Pseq([4, Rest(2), 1, 1], inf),
          Pseq([1.0], inf),
          Pseq([2.0], inf)
        ]));
      },
      2, {
        Pdefn('SpinnyBass', Ptuple([
          Prand([0, 1, 3, 3], inf),
          Pseq([1, 1, 2, 3], inf),
          Prand([
            Pseq([Rest(0.5), 0.5, 0.5, Rest(1), 0.5, 0.5, Rest(2.5), 1, 1]),
            Pseq([1, 1, Rest(2), 1, Rest(0.5), 1, 1, Rest(0.5)])
          ], inf),
          Pseq([1.0, 1.5, 3.0], inf),
          Pseq([2.0, 4.0, 8.0], inf)
        ]));
      }
    );
  }
}
