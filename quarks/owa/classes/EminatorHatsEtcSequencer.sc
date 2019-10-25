EminatorHatsEtcSequencer : AwakenedSequencer {
  var lastSessionPhase,
    hatsInstrument;

  initPatch {
    hatsInstrument = EminatorHatsInstrument.new((
      bufManager: bufManager,
      clock: clock
    ));
  }

  initStream {
    ^hatsInstrument.pattern.asStream();
  }

  handleStateChange {
    var state = store.getState();
    var sessionPhase = state.sessionPhase.asSymbol();
    var lastPropQuant = currentState.propQuant;
    var lastVariationIndex = currentState.variationIndex;
    
    super.handleStateChange();

    if (lastSessionPhase !== sessionPhase, {
      hatsInstrument.updateForSessionPhase(sessionPhase);
      lastSessionPhase = sessionPhase;
    });

    if (lastPropQuant !== currentState.propQuant, {
      hatsInstrument.updatePropQuant(currentState.propQuant);
    });

    if (lastVariationIndex !== currentState.variationIndex, {
      hatsInstrument.useLevel6Variation(currentState.variationIndex);    
    });
  }
}
