EminatorWubBuzzInstrument {
  var bufManager, <patch, <pattern, wubBuzzSampleProvider;
  *new {
    arg params;
    ^super.new().init(params);
  }
  *getSampleProviderMetadatasToLoadList {
    ^[(
      name: 'wub-buzz-slices',
      metadataFilePath: "wub-buzz-slices.json",
      class: SlicedVoiceSampleManager
    )]
  }
  init {
    arg params;
    var synthdef;

    bufManager = params['bufManager'];
    
    wubBuzzSampleProvider = bufManager.getSampleProvider('wub-buzz-slices');
    patch = Patch("owa.eminator.WubBuzzSampler", (
      gate: KrNumberEditor(1.0, \gate),
      amp: KrNumberEditor(-18.0.dbamp(), \amp),
      startTimes: wubBuzzSampleProvider.startTimesBuf.bufnum,
      sample: wubBuzzSampleProvider.sample.bufnum
    ));
    patch.gate.lag = 0;
    synthdef = patch.asSynthDef().add();

    pattern = Pbind(
      \instrument, synthdef.name,
      \dur, Pdefn('WubBuzzRhythm'),
      \index, Pdefn('WubBuzzIndex'),
      //\amp, -10.0.dbamp()
    );
//[0.5].stutter(2 * 7) ++ [Rest(7.0)]
  }

  useVariation {
    arg variationIndex;

    switch(variationIndex,
      0, {
        Pdefn(
          'WubBuzzRhythm',
          Pseq([0.5].stutter(14) ++ [Rest(7.0)], inf)
        );
        Pdefn('WubBuzzIndex', Pseq((0..25), inf));
      },
      1, {
        Pdefn(
          'WubBuzzRhythm',
          Pseq([0.25].stutter(14) ++ [0.5].stutter(7) ++ [Rest(7.0)], inf)
        );
        Pdefn('WubBuzzIndex', Prand((0..25), inf));
      },
      2, {
        Pdefn(
          'WubBuzzRhythm',
          Pwrand(
            [
              Pseq([0.25, 0.25, Rest(0.5)]),
              Pseq([0.5, Rest(0.5)]),
              Pseq([1.0]),
              Pseq([2.0]),
              Pseq([Rest(1.0)])
            ],
            [
              3,
              3,
              2,
              1,
              1
            ].normalizeSum(),
            inf
          )
        );
        Pdefn('WubBuzzIndex', Prand((0..25), inf));
      }
    );
  }

  updatePropQuant {
    arg quant;

    Pdefn('WubBuzzRhythm').quant = quant;
    Pdefn('WubBuzzIndex').quant = quant;
  }
}
