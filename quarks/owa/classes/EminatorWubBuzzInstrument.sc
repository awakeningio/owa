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
      \dur, Pseq([0.5].stutter(2 * 7) ++ [Rest(7.0)], inf),
      \index, Pseq((0..25), inf),
      //\index, Pseq([(0..25), 0].lace(26), inf),
      //\amp, -10.0.dbamp()
    );
//[0.5].stutter(2 * 7) ++ [Rest(7.0)]
  }
}
