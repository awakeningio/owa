EminatorKickSnareSequencer : AwakenedSequencer {
  var 
    snareSynthdef,
    acousticKickSamplerManager,
    electronicSnareSampleManager,
    acousticSnareSampleManager,
    lastSessionPhase,
    kickInstrument,
    snareInstrument;

  initPatch {
    kickInstrument = EminatorKickInstrument.new(params);
    snareInstrument = EminatorSnareInstrument.new(params);
  }

  initStream {
    ^Ppar([
      kickInstrument.pattern,
      snareInstrument.pattern
    ]).asStream();
  }

  handleStateChange {
    var state = store.getState();
    var sessionPhase = state.sessionPhase.asSymbol();
    var lastPropQuant = currentState.propQuant;
    
    super.handleStateChange();

    if (lastSessionPhase !== sessionPhase, {
      kickInstrument.updateForSessionPhase(sessionPhase);
      snareInstrument.updateForSessionPhase(sessionPhase);
      lastSessionPhase = sessionPhase;
    });

    if (currentState.propQuant !== lastPropQuant, {
      kickInstrument.updatePropQuant(currentState.propQuant);    
      snareInstrument.updatePropQuant(currentState.propQuant);    
    });
  }
}
