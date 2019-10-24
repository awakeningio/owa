/**
 *  @file       SpinnyHiHatSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

SpinnyHiHatSequencer : AwakenedSequencer {
  var inst,
    lastSessionPhase;

  initPatch {
    inst = SpinnyHatsInstrument.new(params);
  }

  initStream {
    ^inst.pattern.asStream();
  }

  handleStateChange {
    var state = store.getState();
    var sessionPhase = state.sessionPhase.asSymbol();
    var lastPropQuant = currentState.propQuant;
    var lastVariationIndex = currentState.variationIndex;
    
    super.handleStateChange();

    if (lastSessionPhase !== sessionPhase, {
      inst.updateForSessionPhase(sessionPhase);
      lastSessionPhase = sessionPhase;
    });

    if (currentState.propQuant !== lastPropQuant, {
      inst.updatePropQuant(currentState.propQuant);    
    });

    if (lastVariationIndex !== currentState.variationIndex, {
      if ((sessionPhase == 'QUEUE_TRANS_6').or(sessionPhase == 'TRANS_6').or(sessionPhase == 'PLAYING_6'), {
        inst.useLevel6Variation(currentState.variationIndex);    
      });
    });
  }
}
