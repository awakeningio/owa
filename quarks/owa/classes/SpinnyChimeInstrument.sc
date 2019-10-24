SpinnyChimeInstrument {
  var bufManager, <patch, <pattern, clock;
  *new {
    arg params;
    ^super.new().init(params);
  }
  *getBufsToLoadList {
    ^[
      ["chime high pitch ring_D.wav", \chime_ring_d]
    ]
  }
  init {
    arg params;
    var synthdef,
      originalFreq = "D3".notemidi().midicps();

    bufManager = params['bufManager'];
    clock = params['clockController'].clock;

    patch = Patch("owa.PitchedSampler", (
      originalFreq: originalFreq,
      bufnum: bufManager.bufs[\chime_ring_d].bufnum,
      amp: -20.dbamp(),
      releaseTime: 5.0,
      gate: KrNumberEditor(1, \gate),
      attackTime: 0.3
    ));
    patch.gate.lag = 0;
    synthdef = patch.asSynthDef().add();

    pattern = Ppar([
      Pbind(
        \instrument, synthdef.name,
        \scale, Scale.minor,
        \root, 2,
        \octave, 4,
        [\degree, \dur], Pdefn('SpinnyChimeOne'),
        //\reversed, Pseq([
          //0
        //], inf),
      ),
      Pbind(
        \instrument, synthdef.name,
        \scale, Scale.minor,
        \root, 2,
        \octave, 4,
        [\degree, \dur], Pdefn('SpinnyChimeTwo'),
        //\reversed, Pseq([
          //1
        //], inf),
      )
    ]);
    
  }
  updatePropQuant {
    arg quant;
    Pdefn('SpinnyChimeOne').quant = quant;
    Pdefn('SpinnyChimeTwo').quant = quant;
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

    if (variationIndex == 0, {
      Pdefn('SpinnyChimeOne', Ptuple([
        Pseq([
          \rest,  1,   \rest
        ], inf),
        Pseq([
          7,      0.5,  0.5
        ], inf),
      ]));
      Pdefn('SpinnyChimeTwo', Ptuple([
        Pseq([
          \rest,  4,  \rest,
        ], inf),
        Pseq([
          1,      6,  1
        ], inf),
      ]));
    }, {
      Pdefn('SpinnyChimeOne', Ptuple([
        Pseq([
          \rest,  1,   \rest, 6, 3
        ].scramble, inf),
        Pseq([
          7,      0.5,  0.5, 3, 3, 2
        ].scramble, inf),
      ]));
      Pdefn('SpinnyChimeTwo', Ptuple([
        Pseq([
          \rest,  4,  \rest, 3, 1
        ].scramble, inf),
        Pseq([
          1,      3, 3,  1, 6, 2
        ].scramble, inf),
      ]));
    });
  }
}
