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
      outputChannel.play(patch);

      this.handle_state_change();
      store.subscribe({
        this.handle_state_change();
      });

    }
    initPatch {
      var bufSym = currentState.bufName.asSymbol();
      patch = Patch("cs.sfx.LoopBuf", (
        buf: bufManager.bufs[bufSym],
        gate: gateEditor,
        attackTime: 0.0,
        releaseTime: 15.0 * clock.tempo,
        amp: 1.0
      ));
    }
    handle_state_change {
      var player;
      prevState = currentState;
      currentState = this.getStateSlice();

      if (prevState.playingState != currentState.playingState, {
        if (currentState.playingState == "PLAYING", {
          this.initPatch();
          gateEditor.value = currentState.gate;
          player = outputChannel.play(patch);    
        });    
      });

      if (prevState.gate != currentState.gate, {
        gateEditor.value = currentState.gate;
      });
    }
 }
