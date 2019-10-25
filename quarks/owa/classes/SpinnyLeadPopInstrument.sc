SpinnyLeadPopInstrument {
  var <patch,
    <pattern;
  *new {
    arg params;
    ^super.new().init(params);
  }
  init {
    arg params;
    var patch,
      synthdef;

    patch = Patch("cs.percussion.Impulsive", (
      makeStereo: 1
    ));
    synthdef = patch.asSynthDef().add();
    pattern = Pbind(
      \instrument, synthdef.name,
      \scale, Scale.minor,
      \root, 2,
      \octave, 6,
      [\degree, \dur], Pdefn('SpinnyLeadPop'),
      \amp, 1.0.dbamp()
    );
  }
  updatePropQuant {
    arg quant;
  }
  updateForSessionPhase {
    arg sessionPhase;
    switch(sessionPhase,
      \TRANS_6, {
        this.useLevel6Variation(0);
      },
    );
  }
  useLevel6Variation {
    arg variationIndex;

    switch(variationIndex,
      0, {
        Pdefn('SpinnyLeadPop', Ptuple([
          Pseq([
            Pseq([3, 5], 5),
            Pseq([3, 5, 5, 5], 3)
          ], inf),
          Pseq([
            Pseq([1], 10),
            Pseq([1/2], 12)
          ], inf)
        ]));
      },
      1, {
        Pdefn('SpinnyLeadPop', Ptuple([
          Pseq([3, 5, 7, 2], inf),
          Pseq([1, 1/2, 1/2, 1], inf)
        ]));
      },
      2, {
        Pdefn('SpinnyLeadPop', Ptuple([
          Pseq([3, 5, 7, 2,    Pseq([3, 5], 6)], inf),
          Pseq([1/3, 1/3, 1/3, 1, Pseq([1/2], 12)], inf)
        ]));
      }
    );
  }
}
