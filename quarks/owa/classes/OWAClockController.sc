/**
 *  @file       OWAClockController.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

OWAClockController {
  var <>clock,
    store,
    lastTempo;

  *new {
    arg params;
    ^super.new.init(params);
  }
  init {
    arg params;
    var tempo;
    store = params.store;
    
    tempo = store.getState().tempo;
    lastTempo = tempo;

    clock = TempoClock.new(tempo: tempo / 60.0);
    
    store.subscribe({
      this.handle_state_change();
    });
  }
  handle_state_change {

    var tempo = store.getState().tempo;
    if (tempo != lastTempo, {
      // TODO: handle queueing tempo changes here
    });
    lastTempo = tempo;
  }
  isReady {
    ^(clock != nil);
  }
}
