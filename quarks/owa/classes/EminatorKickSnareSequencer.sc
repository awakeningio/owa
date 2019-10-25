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
    var lastVariationIndex = currentState.variationIndex;
    
    super.handleStateChange();

    if (lastSessionPhase !== sessionPhase, {
      instrument.updateForSessionPhase(sessionPhase);
      lastSessionPhase = sessionPhase;
    });

    if (currentState.propQuant !== lastPropQuant, {
      instrument.updatePropQuant(currentState.propQuant);    
    });

    if (lastVariationIndex !== currentState.variationIndex, {
      if ((sessionPhase == 'QUEUE_TRANS_6').or(sessionPhase == 'TRANS_6').or(sessionPhase == 'PLAYING_6'), {
        instrument.useLevel6Variation(currentState.variationIndex);    
      });
    });
  }
}
