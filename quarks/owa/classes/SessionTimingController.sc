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
    var nextSessionPhases = OWAConstants.nextSessionPhases;
    var nextPhase;

    //"SessionTimingController.handle_state_change".postln();

    if (state.sessionPhase != lastState.sessionPhase, {
      lastState.sessionPhase = state.sessionPhase;

      // if we should automatically transition
      if (
        autoTransitionSessionPhases.includes(
          state.sessionPhase.asSymbol()
      ), {
        nextPhase = nextSessionPhases[state.sessionPhase.asSymbol()];
        this.schedule_transition_to_phase(nextPhase);
      });

    });
  }

  schedule_transition_to_phase {
    arg phase;
    var phaseDuration = 16;

    (
      "[SessionTimingController]: Scheduling transition to phase "
      ++ phase
    ).postln();

    clockController.clock.play({
      store.dispatch((
        type: 'SESSION_PHASE_ADVANCED',
        payload: (
          phase: phase
        )
      ));
    }, [phaseDuration, 0]);
  }
}
