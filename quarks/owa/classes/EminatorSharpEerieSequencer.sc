EminatorSharpEerieSequencer : AwakenedSequencer {
  var synthdef,
		bufnums;
  initPatch {
    synthdef = Patch("owa.eminator.SharpEerieSampler", (
      gate: KrNumberEditor(1, \gate),
    )).asSynthDef().add();

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
  }

  initStream {
    ^Pbind(
      \instrument, synthdef.name,
      \sampleBufnumIndex, Pseq([0, 1, 2, 3, 4, 5, 6, 7, 8], inf),
      \sampleBufnum, Pfunc({
        arg e;
        bufnums[e[\sampleBufnumIndex]]
      }),
      \midinote, "C1".notemidi(),
      \dur, Prand([
        Pseq([
          2, Rest(5)
        ]), Pseq([
          Rest(7)
        ])
      ], inf)
    ).asStream();
  }
}
