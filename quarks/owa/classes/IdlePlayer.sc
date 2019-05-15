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
    outputChannel,
    bufManager,
    patches,
    players,
    state,
    clock,
    prevState,
    gateEditorBySongId;

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

      outputChannel = MixerChannel.new(
        "IdlePlayer",
        Server.default,
        2, 2,
        outbus: 0
      );
      outputChannel.level = -3.0.dbamp();

      // initializes a gate for each song
      gateEditorBySongId = Dictionary.new();
      OWAConstants.songIdsList.do({
        arg songId;
        gateEditorBySongId[songId] = KrNumberEditor(0, \gate);
      });

      patches = Array.new();
      players = Array.new();

      this.initPatch();

      //this.handle_state_change();
      store.subscribe({
        this.handle_state_change();
      });

    }
    initPatch {
      var bufSym;
      //"IdlePlayer.initPatch".postln();
      //bufSym = state.idlePlayer.bufName.asSymbol();
      patches = patches.add(Patch("owa.IdleLooper", (
        buf: bufManager.bufs['eerie_idle_loop'],
        gate: gateEditorBySongId[OWAConstants.songIds['SPINNY_PLUCK']],
        attackTime: 0.0,
        releaseTime: 15.0 * clock.tempo,
        amp: 1.0
      )));
      patches = patches.add(Patch("owa.EminatorIdle", (
        gate: gateEditorBySongId[OWAConstants.songIds['EMINATOR']],
        attackTime: 1.0,
        releaseTime: 15.0 * clock.tempo,
        amp: 1.0
      )));
    }
    handle_state_change {
      var player,
        songId;
      //"IdlePlayer.handle_state_change".postln();
      prevState = state;
      state = store.getState();
      songId = state.songId.asSymbol();

      if (prevState.idlePlayer.gate != state.idlePlayer.gate, {
        (
          "IdlePlayer: setting gate to "
          ++ state.idlePlayer.gate
          ++ " for songId: "
          ++ songId
        ).postln();
        gateEditorBySongId[songId].value = state.idlePlayer.gate;
      });

      if (prevState.idlePlayer.playingState != state.idlePlayer.playingState, {
        if (state.idlePlayer.playingState == "PLAYING", {
          //"IdlePlayer.playing...".postln();
          patches.do({
            arg patch;

            players.add(outputChannel.play(patch));
          });
        });    
      });

    }
 }
