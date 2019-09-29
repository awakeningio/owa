EminatorSharpEerieSequencer : AwakenedSequencer {
  var synthdef,
		bufnums,
    lastSessionPhase,
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
    
    super.handleStateChange();

    if (lastSessionPhase !== sessionPhase, {
      instrument.handleSessionPhaseChanged(sessionPhase);
      instrument.updatePlayQuant(currentState.playQuant);
      lastSessionPhase = sessionPhase;
    });
    instrument.updatePlayQuant(currentState.playQuant);
  }
}
