/**
 *  @file       IdlePlayer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

 IdlePlayer {
   var store,
    bufManager,
    player,
    state,
    clock,
    prevState,
    patchesBySongId;

    *new {
      arg params;
      ^super.new.init(params);
    }
    init {
      arg params;
      var bufSym;
      //"IdlePlayer.init".postln();
      store = params['store'];
      bufManager = params['bufManager'];
      clock = params['clock'];
      state = store.getState();
      prevState = state;

      // initializes a gate for each song
      patchesBySongId = Dictionary.new();

      this.initPatch();

      //this.handle_state_change();
      store.subscribe({
        this.handle_state_change();
      });

    }
    initPatch {
      //var bufSym;
      //"IdlePlayer.initPatch".postln();
      //bufSym = state.idlePlayer.bufName.asSymbol();
      patchesBySongId['spinny_pluck'] = Patch("owa.IdleLooper", (
        buf: bufManager.bufs['eerie_idle_loop'],
        gate: KrNumberEditor(0, \gate),
        attackTime: 0.0,
        releaseTime: 15.0 * clock.tempo,
        amp: 1.0
      ));
      patchesBySongId['spinny_pluck'].gate.lag = 0;
      patchesBySongId['eminator'] = Patch("owa.EminatorIdle", (
        gate: KrNumberEditor(0, \gate),
        attackTime: 1.0,
        releaseTime: 16.0 * clock.tempo,
        amp: -3.0.dbamp(),
        transitionGate: 0,
        transitionDuration: 0
      ));
      patchesBySongId['eminator'].gate.lag = 0;
    }
    handle_state_change {
      var songId;
      //"IdlePlayer.handle_state_change".postln();
      prevState = state;
      state = store.getState();
      songId = state.songId.asSymbol();

      //if (prevState.songId != state.songId, {
        //patchesBySongId[songId].gate.value = 0;
      //});

      if (prevState.idlePlayer.playingState != state.idlePlayer.playingState, {
        if (state.idlePlayer.playingState == "PLAYING", {
          "IdlePlayer.playing...".postln();
          if (player.isNil().not(), {
            player.gate.value = 0;
            player.stop();
          });
          patchesBySongId[songId].gate.value = state.idlePlayer.gate;
          player = patchesBySongId[songId].play();
        }, {
          if (player.isNil().not(), {
            player.gate.value = 0;
            player.stop();
            player = nil;
          });
        });
      });
      if (player.isNil().not().and(state.idlePlayer.gate != prevState.idlePlayer.gate), {
        (
          "IdlePlayer: setting gate to "
          ++ state.idlePlayer.gate
          ++ " for songId: "
          ++ songId
        ).postln();
        player.gate.value = state.idlePlayer.gate;
        "player.gate.value:".postln;
        player.gate.value.postln;
      });
      
    }
 }
