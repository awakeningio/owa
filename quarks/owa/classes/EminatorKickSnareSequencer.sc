EminatorKickSnareSequencer : AwakenedSequencer {
  var 
    snareSynthdef,
    lastSessionPhase,
    instrument;

  initPatch {
    instrument = EminatorKickSnareInstrument.new(params);
  }

  initStream {
    ^instrument.pattern.asStream();
  }

  handleStateChange {
    var state = store.getState();
    var sessionPhase = state.sessionPhase.asSymbol();
    var lastPropQuant = currentState.propQuant;
    
    super.handleStateChange();

    if (lastSessionPhase !== sessionPhase, {
      instrument.updateForSessionPhase(sessionPhase);
      lastSessionPhase = sessionPhase;
    });

    if (currentState.propQuant !== lastPropQuant, {
      instrument.updatePropQuant(currentState.propQuant);    
    });
  }
}
