/**
 *  @file       OWAController.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

OWAController {
  classvar <>instance;

  // MixerChannel instance
  var outputChannel,
    <>store,
    //<>linkStore,
    sessionController,
    sounds,
    bufManager,
    clockController,
    seqFactory;


  *new {
    ^super.new.boot();
  }

  boot {
    store = StateStore.new(());
    store.setDispatchLocations((
      \main: (
        addr: "127.0.0.1",
        port: "SC_OSC_OUT_PORT".getenv().asInteger()
      )
    ));

    //linkStore = StateStore.new(());
    
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

    seqFactory = AwakenedSequencerFactory.getInstance();
    seqFactory.setBufManager(bufManager);

    sounds = List.new();

    store.dispatch((
      type: "OWA_SOUND_BOOTED"
    ));
  }

  init {
    arg params;
    "OWAController.init".postln();
    //"params:".postln;
    //params.postln;

    OWAConstants.init(params);

    store.subscribe({
      this.handle_state_change();
    });

    //clockController = ReduxAbletonTempoClockController.new((
      //store: linkStore,
      //clockOffsetSeconds: 0.0
    //));
    clockController = OWAClockController.new((
      store: store
    ));

    seqFactory.setClockController(clockController);

    sessionController = SessionTimingController.new((
      store: store,
      clockController: clockController
    ));
    

    bufManager.load_bufs([
      ["subtle_kick_01 [2018-04-13 134203].wav", \subtle_kick_01],
      ["subtle_kick_02 [2018-04-13 134203].wav", \subtle_kick_02],
      ["subtle_kick_03 [2018-04-13 134203].wav", \subtle_kick_03]
    ], ({
      // when buffers are done loading
      // load midi files
      bufManager.load_midi([
        ["subtle_kick.mid", \subtle_kick, 8]
      ]);
      // initialize sequencers
      seqFactory.setStore(store);
      // tell main process we are done
      store.dispatch((
        type: "OWA_SOUND_INIT_DONE"
      ));
    }));


    ^this;
  }

  handle_state_change {
  }


  //initSound {
    //arg sound;

    //sounds.add(
      //QueuableSound.new((
        //store: this.store,
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

    //this.store = StateStore.new(initialState);
    //state = this.store.getState();

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
