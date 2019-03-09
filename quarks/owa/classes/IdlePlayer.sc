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
    patch,
    state,
    clock,
    prevState,
    gateEditor;

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
      outputChannel.level = 1.0;

      gateEditor = KrNumberEditor(0, \gate);
      this.initPatch();

      //this.handle_state_change();
      store.subscribe({
        this.handle_state_change();
      });

    }
    initPatch {
      var bufSym;
      //"IdlePlayer.initPatch".postln();
      bufSym = state.idlePlayer.bufName.asSymbol();
      patch = Patch("owa.IdleLooper", (
        buf: bufManager.bufs[bufSym],
        gate: gateEditor,
        attackTime: 0.0,
        releaseTime: 15.0 * clock.tempo,
        amp: 1.0
      ));
    }
    handle_state_change {
      var player;
      //"IdlePlayer.handle_state_change".postln();
      prevState = state;
      state = store.getState();

      if (prevState.idlePlayer.gate != state.idlePlayer.gate, {
        //("IdlePlayer: setting gate to " ++ state.idlePlayer.gate).postln();
        gateEditor.value = state.idlePlayer.gate;
      });

      if (prevState.idlePlayer.playingState != state.idlePlayer.playingState, {
        if (state.idlePlayer.playingState == "PLAYING", {
          //"IdlePlayer.playing...".postln();
          player = outputChannel.play(patch);    
        });    
      });

    }
 }
