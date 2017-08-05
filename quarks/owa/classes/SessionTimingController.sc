SessionTimingController {
  var store,
    clockController,
    lastState;
    
  *new {
    arg params;

    ^super.new.init(params);
  }

  init {
    arg params;

    store = params.store;
    clockController = params.clockController;

    lastState = (
      sessionPhase: nil
    );

    store.subscribe({
      this.handle_state_change();
    });

    
  }

  handle_state_change {
    var state = store.getState();
    var autoTransitionSessionPhases = OWAConstants.autoTransitionSessionPhases;

    "SessionTimingController.handle_state_change".postln();

    if (state.sessionPhase != lastState.sessionPhase, {
      lastState.sessionPhase = state.sessionPhase;

      // if we should automatically transition
      if (
        autoTransitionSessionPhases.includes(
          state.sessionPhase.asSymbol()
      ), {
        "setting up auto transition".postln();
      });

    });
  }
}
