/**
 *  @file       LevelTimingController.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

/**
 *  @class        LevelTimingController
 *
 *  @classdesc    Handles the timing for one level.
 **/
LevelTimingController {
  var store,
    lastState,
    levelId;
  *new {
    arg params;

    ^super.new.init(params);
  }
  init {
    arg params;

    store = params.store;
    levelId = params.levelId;
    
    lastState = (
      levelPlayingState: nil
    );

    this.handle_state_change();
    store.subscribe({
      this.handle_state_change();
    });
  }

  handle_state_change {
    var state = store.getState(),
      levelPlayingState = state.levels[levelId].playingState;

    // if level playback state changed
    if (lastState.levelPlayingState != levelPlayingState, {
      "level playing state changed!".postln();
      lastState.levelPlayingState = levelPlayingState;

      switch(levelPlayingState)
        {"QUEUED"} {
          this.queue();
        }
        {"PLAYING"} {
          this.play();
        }
        {"STOP_QUEUED"} {
          this.queueStop();
        }
    });
  }

  queue {
    // the level is queued
  }

  play { 
    // the level starts playing
  }

  queueStop {
    // the level should stop playing
  }
}
