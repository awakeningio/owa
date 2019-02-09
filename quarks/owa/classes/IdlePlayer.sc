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
    currentState,
    clock,
    prevState,
    gateEditor;

    *new {
      arg params;
      ^super.new.init(params);
    }
    getStateSlice {
      ^store.getState().idlePlayer;
    }
    init {
      arg params;
      var bufSym, state;
      store = params['store'];
      bufManager = params['bufManager'];
      clock = params['clock'];
      state = store.getState();

      prevState = (
        playingState: false,
        gate: false
      );

      outputChannel = MixerChannel.new(
        "IdlePlayer",
        Server.default,
        2, 2,
        outbus: 0
      );
      outputChannel.level = 1.0;

      currentState = this.getStateSlice();
      gateEditor = KrNumberEditor(0, \gate);
      this.initPatch();

      //this.handle_state_change();
      store.subscribe({
        this.handle_state_change();
      });

    }
    initPatch {
      var bufSym = currentState.bufName.asSymbol();
      //"IdlePlayer.initPatch".postln();
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
      prevState = currentState;
      currentState = this.getStateSlice();

      if (prevState.gate != currentState.gate, {
        ("IdlePlayer: setting gate to " ++ currentState.gate).postln();
        gateEditor.value = currentState.gate;
      });

      if (prevState.playingState != currentState.playingState, {
        if (currentState.playingState == "PLAYING", {
          //"IdlePlayer.playing...".postln();
          player = outputChannel.play(patch);    
        });    
      });

    }
 }
