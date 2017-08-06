OWAController {
  classvar <>instance;

  // MixerChannel instance
  var outputChannel,
    <>owaStore,
    <>linkStore,
    <>sequencers,
    sessionController,
    sounds,
    sequencerNameToClass,
    bufManager,
    clockController,
    levelControllers;


  *new {
    ^super.new.boot();
  }

  boot {
    owaStore = StateStore.new(());
    owaStore.setDispatchLocations((
      \main: (
        addr: "127.0.0.1",
        port: "SC_OSC_OUT_PORT".getenv().asInteger()
      )
    ));

    linkStore = StateStore.new(());
    
    outputChannel = MixerChannel.new(
      "OWAController",
      Server.default,
      2, 2,
      outbus: 0
    );

    outputChannel.level = 1.0;

    //  create the buffer manager that will load the samples we need for this
    //  patch.
    bufManager = BufferManager.new((
      rootDir: "SOUNDS_DIRECTORY_PATH".getenv()
    ));

    sequencerNameToClass = (
      simple: SimpleSequencer
    );


    this.sequencers = List.new();
    sounds = List.new();
    levelControllers = List.new();

    owaStore.dispatch((
      type: "OWA_SOUND_BOOTED"
    ));
  }

  init {
    arg params;
    //var me = this;
    //var now = thisThread.clock.seconds;
    //var tempo = 150.0/60.0;
    //var tickClock;
    
    // This only works when sclang is launched from a terminal, not from
    // the GUI.
    "OWAController.init".postln();

    OWAConstants.init(params);

    owaStore.subscribe({
      this.handle_state_change();
    });

    clockController = ReduxAbletonTempoClockController.new((
      store: linkStore,
      clockOffsetSeconds: 0.0
    ));

    sessionController = SessionTimingController.new((
      store: owaStore,
      clockController: clockController
    ));

    owaStore.dispatch((
      type: "OWA_SOUND_INIT_DONE"
    ));


    ^this;
  }

  handle_state_change {
    var state = this.owaStore.getState();

    "OWAController.handle_state_change".postln();

    if ((sequencers.size() == 0).and(state.sequencers != nil), {
      "[OWAController]: Initializing sequencers list".postln();
      state.sequencers.do({
        arg sequencerState;
        this.initSequencer(sequencerState);
      });
    });

    if ((levelControllers.size() == 0).and(state.levels != nil), {
      "[OWAController]: Initializing level controllers".postln();    
      state.levels.keysValuesDo({
        arg levelId, levelState;
        levelControllers.add(
          LevelTimingController.new((
            store: owaStore,
            levelId: levelId
          ));
        )
      });
    });
  }

  initSequencer {
    arg sequencer;

    this.sequencers.add(
      sequencerNameToClass[sequencer.name.asSymbol()].new((
        store: this.owaStore,
        sequencerId: sequencer.sequencerId,
        bufManager: bufManager,
        //outputChannel: outputChannel,
        clockController: clockController
      ))
    );
  }

  //initSound {
    //arg sound;

    //sounds.add(
      //QueuableSound.new((
        //owaStore: this.owaStore,
        //name: sound.name,
        //outputChannel: outputChannel,
        //bufManager: bufManager
      //));
    //);
  //}

  //initFromAPI {
    //arg initialState;
    //var state,
      //me = this;

    //this.owaStore = StateStore.new(initialState);
    //state = this.owaStore.getState();

    //TempoClock.default.tempo = state.tempo / 60.0;

    //// TODO: Kill any currently running sequencers

    //// load all bufs
    //"loading buffers...".postln();
    //bufManager.load_bufs(state.bufferList, {
      ////"initializing sounds...".postln();
      ////state.sounds.do({
        ////arg sound;
        ////me.initSound(sound);
      ////});

      ////"initializing sequencers...".postln();
      ////// create sequencers
      ////state.sequencers.do({
        ////arg sequencer;
        ////"sequencer:".postln;
        ////sequencer.postln;
        ////me.initSequencer(sequencer);
      ////});


    //});
  //}

  /**
   *  This is a singleton, use this method to get the
   *  instance.
   */
  *getInstance {
    if (this.instance == nil, {
      this.initInstance();
    });

    ^this.instance;
  }

  *initInstance {
    arg params;
    if (this.instance != nil, {
      "OWAAlreadyInstantiated".throw();    
    }, {
      this.instance = OWAController.new(());
    });
    ^this.instance;
  }
}
