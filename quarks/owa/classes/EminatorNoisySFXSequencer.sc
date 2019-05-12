EminatorNoisySFXSequencer : AwakenedSequencer {
  var wubBuzzSynthdef,
    wubBuzzSampleManager;

  initPatch {
    wubBuzzSampleManager = OWASampleManager.getInstance()
      .getVoiceSampleManager('wub-buzz-slices');

    wubBuzzSynthdef = Patch("owa.eminator.WubBuzzSampler", (
      gate: KrNumberEditor(1.0, \gate),
      amp: KrNumberEditor(-13.0.dbamp(), \amp),
      startTimes: wubBuzzSampleManager.startTimesBuf.bufnum,
      sample: wubBuzzSampleManager.sample.bufnum
    )).asSynthDef().add();
  }

  initStream {
    ^Pbind(
      \instrument, wubBuzzSynthdef.name,
      \dur, Pseq([0.5].stutter(2 * 7) ++ [Rest(7.0)], inf),
      \index, Pseq((0..25), inf),
      //\index, Pseq([(0..25), 0].lace(26), inf),
      \amp, -10.0.dbamp()
    ).asStream();
  }
}

//[0.5].stutter(2 * 7) ++ [Rest(7.0)]
