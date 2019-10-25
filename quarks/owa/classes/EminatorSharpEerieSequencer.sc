EminatorSharpEerieSequencer : AwakenedSequencer {
  var synthdef,
		bufnums,
    lastSessionPhase,
    lastVariationIndex,
    instrument;
  init {
    arg params;
  
    instrument = EminatorSharpEerieInstrument.new((
      bufManager: params['bufManager']
    ));
    
    super.init(params);
  }
  initStream {
    ^instrument.pattern.asStream();
  }
  handleStateChange {
    var state = store.getState();
    var sessionPhase = state.sessionPhase.asSymbol();
    lastVariationIndex = currentState.variationIndex;
    
    super.handleStateChange();

    instrument.updatePropQuant(currentState.propQuant);
    if (lastSessionPhase !== sessionPhase, {
      instrument.handleSessionPhaseChanged(sessionPhase);
      lastSessionPhase = sessionPhase;
    });
    if (lastVariationIndex !== currentState.variationIndex, {
      instrument.useVariation(currentState.variationIndex);    
    });
  }
}
