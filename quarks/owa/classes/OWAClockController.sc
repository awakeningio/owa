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
    store;

  *new {
    arg params;
    ^super.new.init(params);
  }
  init {
    arg params;
    var tempo;
    store = params.store;
    
    store.subscribe({
      this.handle_state_change();
    });

    tempo = store.getState().tempo;

    clock = TempoClock.new(tempo: tempo / 60.0);
  }
  handle_state_change {
    // TODO: handle queueing tempo changes here
  }
  isReady {
    ^(clock != nil);
  }
}
