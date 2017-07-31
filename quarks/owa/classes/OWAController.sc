OWAController {
  classvar <>instance;

  // MixerChannel instance
  var outputChannel,
    <>store,
    <>sequencers,
    sounds,
    sequencerNameToClass,
    bufManager;


  *new {
    arg params;

    ^super.new.init(params);
  }

  init {
    arg params;
    var me = this;
    var now = thisThread.clock.seconds;
    var tempo = 150.0/60.0;
    var tickClock;
    
    // This only works when sclang is launched from a terminal, not from
    // the GUI.
    var projDir = File.getcwd();

    "OWAController.init".postln();

    store = StateStore.getInstance();
    store.setDispatchLocations((
      \main: (
        addr: "127.0.0.1",
        port: "SC_OSC_OUT_PORT".getenv().asInteger()
      )
    ));

    outputChannel = MixerChannel.new(
      "OWAController",
      Server.default,
      2, 2,
      outbus: 0
    );

    outputChannel.level = 0.2;

    //  create the buffer manager that will load the samples we need for this
    //  patch.
    bufManager = BufferManager.new((
      rootDir: projDir +/+ "sounds"
    ));

    //sequencerNameToClass = (
      //zaps: LazersSequencer,
      //orgperc: OrganicPercussionSequencer,
      //pad: RightSequencer
    //);


    this.sequencers = List.new();
    sounds = List.new();

    store.subscribe({
      this.handle_state_change();
    });

    store.dispatch((
      type: "OWA_SOUND_INIT_DONE"
    ));


    ^this;
  }

  handle_state_change {
    var state = this.store.getState();

    "OWAController.handle_state_change".postln();
    "state:".postln;
    state.postln;
  }

  initSequencer {
    arg sequencer;

    this.sequencers.add(
      sequencerNameToClass[sequencer.name.asSymbol()].new((
        store: this.store,
        name: sequencer.name,
        outputChannel: outputChannel,
        bufManager: bufManager
      ))
    );
  }

  initSound {
    arg sound;

    sounds.add(
      QueuableSound.new((
        store: this.store,
        name: sound.name,
        outputChannel: outputChannel,
        bufManager: bufManager
      ));
    );
  }

  initFromAPI {
    arg initialState;
    var state,
      me = this;

    this.store = StateStore.new(initialState);
    state = this.store.getState();

    TempoClock.default.tempo = state.tempo / 60.0;

    // TODO: Kill any currently running sequencers

    // load all bufs
    "loading buffers...".postln();
    bufManager.load_bufs(state.bufferList, {
      //"initializing sounds...".postln();
      //state.sounds.do({
        //arg sound;
        //me.initSound(sound);
      //});

      //"initializing sequencers...".postln();
      //// create sequencers
      //state.sequencers.do({
        //arg sequencer;
        //"sequencer:".postln;
        //sequencer.postln;
        //me.initSequencer(sequencer);
      //});


    });
  }

  /**
   *  This is a singleton, use this method to get the
   *  instance.
   */
  *getInstance {
    if (this.instance == nil, {
      this.instance = OWAController.new(());
    });

    ^this.instance;
  }
}
