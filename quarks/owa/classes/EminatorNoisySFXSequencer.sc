EminatorNoisySFXSequencer : SCReduxSequencer {
  var wubBuzzInstrument;

  initPatch {
    wubBuzzInstrument = EminatorWubBuzzInstrument.new(params);
  }

  initStream {
    ^wubBuzzInstrument.pattern.asStream();
  }

  handleStateChange {
    var lastVariationIndex = currentState.variationIndex;
    var lastPropQuant = currentState.propQuant;

    super.handleStateChange();

    if (lastVariationIndex !== currentState.variationIndex, {
      wubBuzzInstrument.useVariation(currentState.variationIndex);
    });

    if (lastPropQuant !== currentState.propQuant, {
      wubBuzzInstrument.updatePropQuant(currentState.propQuant);    
    });
  }
}

