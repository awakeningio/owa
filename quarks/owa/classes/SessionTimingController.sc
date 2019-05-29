/**
 *  @file       SessionTimingController.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

/**
 *  @class        SessionTimingController
 *
 *  @classdesc    Handles the timing for an entire session.
 **/
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
      sessionPhase: nil,
      revealReady: false
    );

    store.subscribe({
      this.handle_state_change();
    });

    
  }

  handle_state_change {
    var state = store.getState();
    var autoTransitionSessionPhases = OWAConstants.autoTransitionSessionPhases;

    //"SessionTimingController.handle_state_change".postln();

    //"state.sessionPhase:".postln;
    //state.sessionPhase.postln;
    //"lastState.sessionPhase:".postln;
    //lastState.sessionPhase.postln;

    if (
      (
        state.sessionPhase != lastState.sessionPhase
      ).or(
        state.revealReady != lastState.revealReady
      ), {
      lastState.sessionPhase = state.sessionPhase;
      lastState.revealReady = state.revealReady;

      // if we should automatically transition
      if (
        autoTransitionSessionPhases.includes(
          state.sessionPhase.asSymbol()
        ).or(
          (
            state.sessionPhase == "PLAYING_2"
          ).and(state.revealReady == true)
        ),
      {
        this.schedule_transition_to_next_phase();
      });

    });
  }

  schedule_transition_to_next_phase {
    var phaseDuration,
      nextPhase,
      state,
      phaseMeter,
      sessionPhase,
      sessionPhaseDurations,
      songId;

    state = store.getState();
    songId = state.songId.asSymbol();
    sessionPhase = state.sessionPhase.asSymbol();
    nextPhase = OWAConstants.nextSessionPhases[sessionPhase];
    sessionPhaseDurations = OWAConstants.sessionPhaseDurationsBySongId[songId];
    phaseDuration = sessionPhaseDurations[sessionPhase];
    phaseMeter = OWAConstants.sessionPhaseBeatPerBarBySongId[songId][sessionPhase];

    (
      "[SessionTimingController]: Scheduling transition to phase "
      ++ nextPhase ++ " after duration " ++ phaseDuration
    ).postln();

    clockController.clock.play({
      store.dispatch((
        type: 'SESSION_PHASE_ADVANCED',
        payload: (
          phase: nextPhase
        )
      ));
    }, [phaseMeter, phaseDuration]);
  }
}
