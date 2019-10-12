EminatorNoisySFXSequencer : AwakenedSequencer {
  var wubBuzzInstrument;

  initPatch {
    wubBuzzInstrument = EminatorWubBuzzInstrument.new(params);
  }

  initStream {
    ^wubBuzzInstrument.pattern.asStream();
  }
}

