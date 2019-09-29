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
      \sampleBufnumIndex, Pseq([0, 1, 2, 3, 4, 5, 6, 7, 8], inf),
      \sampleBufnum, Pfunc({
        arg e;
        bufnums[e[\sampleBufnumIndex]]
      }),
      \midinote, "C1".notemidi(),
      \dur, Pdefn('EminatorSharpEerieDurs')
    );
  }

  handleSessionPhaseChanged {
    arg sessionPhase;

    switch(sessionPhase, 
      \TRANS_6, {
        Pdefn(
          'EminatorSharpEerieDurs',
          Prand([
            Pseq([
              2, Rest(5)
            ]), Pseq([
              Rest(7)
            ])
          ], inf)
        );
      },
      \TRANS_4, {
        Pdefn(
          'EminatorSharpEerieDurs',
          Prand([
            Pseq([
              2, Rest(2)
            ]), Pseq([
              Rest(4)
            ])
          ], inf)
        );
      },
      \TRANS_2, {
        Pdefn(
          'EminatorSharpEerieDurs',
          Prand([
            Pseq([
              2, 2
            ]), Pseq([
              Rest(4)
            ])
          ], inf)
        );
      }
    );
  }

  updatePlayQuant {
    arg playQuant;
    Pdefn('EminatorSharpEerieDurs').quant = playQuant;
  }

}
