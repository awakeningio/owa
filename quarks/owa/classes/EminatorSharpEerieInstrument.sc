EminatorSharpEerieInstrument {
  var <patch, <pattern, <stream, bufManager;
  *getBufsToLoadList {
    ^[
      ["sharp_eerie/eerie_L6_01 [2019-05-10 104045]_mono.aif", \sharp_eerie_01],
      ["sharp_eerie/eerie_L6_02 [2019-05-10 104045]_mono.aif", \sharp_eerie_02],
      ["sharp_eerie/eerie_L6_03 [2019-05-10 104045]_mono.aif", \sharp_eerie_03],
      ["sharp_eerie/eerie_L6_04 [2019-05-10 104045]_mono.aif", \sharp_eerie_04],
      ["sharp_eerie/eerie_L6_05 [2019-05-10 104045]_mono.aif", \sharp_eerie_05],
      ["sharp_eerie/eerie_L6_06 [2019-05-10 104045]_mono.aif", \sharp_eerie_06],
      ["sharp_eerie/eerie_L6_07 [2019-05-10 104045]_mono.aif", \sharp_eerie_07],
      ["sharp_eerie/eerie_L6_08 [2019-05-10 104045]_mono.aif", \sharp_eerie_08],
      ["sharp_eerie/eerie_L6_09 [2019-05-10 104045]_mono.aif", \sharp_eerie_09],
    ]
  }
  *new {
    arg params;
    ^super.new().init(params);
  }
  init {
    arg params;
    var synthdef, bufnums;

    bufManager = params['bufManager'];
    
    patch = Patch("owa.eminator.SharpEerieSampler", (
      gate: KrNumberEditor(1, \gate),
    ));
    patch.gate.lag = 0;
    synthdef = patch.asSynthDef().add();

    bufnums = [
      \sharp_eerie_01,
      \sharp_eerie_02,
      \sharp_eerie_03,
      \sharp_eerie_04,
      \sharp_eerie_05,
      \sharp_eerie_06,
      \sharp_eerie_07,
      \sharp_eerie_08,
      \sharp_eerie_09
    ].collect({
      arg bufSym;

      bufManager.bufs[bufSym].bufnum
    });

    pattern = Pbind(
      \instrument, synthdef.name,
      \sampleBufnumIndex, Prand([0, 1, 2, 3, 4, 5, 6, 7, 8], inf),
      \sampleBufnum, Pfunc({
        arg e;
        bufnums[e[\sampleBufnumIndex]]
      }),
      \midinote, "C1".notemidi(),
      [\dur, \rate], Pdefn('EminatorSharpEerieNotes'),
    );
  }

  useVariation {
    arg variationIndex;

    "variationIndex:".postln;
    variationIndex.postln;

    switch(variationIndex,
      0, {
        Pdefn(
          'EminatorSharpEerieNotes',
          Prand([
            Ptuple([
              Pseq([2, Rest(5)]),
              1.0
            ]),
            Ptuple([
              Pseq([Rest(7)]),
              1.0
            ])
          ], inf)
        );
      },
      1, {
        Pdefn(
          'EminatorSharpEerieNotes',
          Pwrand(
            [
              Ptuple([
                Pseq([1, 1, Rest(5)]),
                Prand([1.5, 2.0])
              ]),
              Ptuple([
                Pseq([1, Rest(1), 1, Rest(4)]),
                Prand([1.0, 2.0])
              ]),
              Ptuple([Pseq([2, Rest(5)]), 1.0]),
              Ptuple([Pseq([Rest(7)]), 1.0])
            ],
            [
              2,
              2,
              1,
              1
            ].normalizeSum(),
            inf
          )
        );
      },
      2, {
        Pdefn(
          'EminatorSharpEerieNotes',
          Pwrand(
            [
              Ptuple([
                Pseq([Rest(0.5), 0.5, Rest(0.5), 0.5, Rest(0.5), Rest(4.5)]),
                Pseq([1.0,      2.0,  1.0,      2.5,    1.0,    1.0])
              ]),
              Ptuple([
                Pseq([Rest(0.5), 1, Rest(1), 1, Rest(3.5)]),
                Pseq([1.0,      -2.0,2.0,    -2.0,1.0])
              ]),
              Ptuple([
                Pseq([Rest(0.5), 2, Rest(4.5)]),
                -1.0
              ]),
              Ptuple([
                Pseq([Rest(7)]),
                -1.0
              ]),
            ],
            [
              3,
              2,
              1,
              1
            ].normalizeSum(),
            inf
          )
        );
      },
      3, {
        Pdefn(
          'EminatorSharpEerieNotes',
          Pwrand(
            [
              Prand([
                Ptuple([
                  Pseq([0.25, 0.25, Rest(0.25), 0.25]),
                  Pseq([2.0,  -2.0,  1.0,  -2.0])
                ]),
                Ptuple([
                  Pseq([0.25, 0.25, 0.25, 0.25]),
                  Pseq([2.0,  2.5,  2.0,  -2.0])
                ]),
                Ptuple([
                  Pseq([Rest(1)]),
                  1
                ]),
              ], 7),
              Ptuple([
                Prand([
                  Pseq([0.5, 1, Rest(1), 1]),
                  Pseq([Rest(3.5)])
                ], 2),
                0.5
              ]),
              Ptuple([
                Pseq([0.5, 1, 1, Rest(4.5)]),
                -1.0
              ]),
              Ptuple([
                Pseq([0.5, 1, Rest(1), 1, Rest(3.5)]),
                -1.0
              ]),
              Ptuple([
                Pseq([0.5, 2, Rest(4.5)]),
                1.0
              ]),
              Ptuple([
                Pseq([Rest(7)]),
                1.0
              ]),
            ],
            [
              4,
              4,
              3,
              3,
              2,
              1
            ].normalizeSum(),
            inf
          )
        );
      }
    );
  }

  handleSessionPhaseChanged {
    arg sessionPhase;

    switch(sessionPhase, 
      \TRANS_6, {
        this.useVariation(0);
      },
      \TRANS_4, {
        Pdefn(
          'EminatorSharpEerieNotes',
          Prand([
            Ptuple([
              Pseq([2, Rest(2)]),
              1.0
            ]),
            Ptuple([
              Pseq([Rest(4)]),
              1.0
            ])
          ], inf)
        );
      },
      \TRANS_2, {
        Pdefn(
          'EminatorSharpEerieNotes',
          Prand([
            Ptuple([
              Pseq([2, 2]),
              1.0
            ]),
            Ptuple([
              Pseq([Rest(4)]),
              1.0
            ])
          ], inf)
        );
      }
    );
  }

  updatePropQuant {
    arg propQuant;
    Pdefn('EminatorSharpEerieNotes').quant = propQuant;
  }

}
