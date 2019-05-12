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
    seqFactory,
    idlePlayer,
    sampleManager;


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

    //OSCFunc.new({
      //arg msg, time, addr, recvPort;
    //}, '/owa/init')

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
    ^this;
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
      ["kick_01 [2018-05-20 115711].wav", \kick_01],
      ["hhclosed_96 [2018-05-20 155504].wav", \hhclosed_96],
      ["hhopen_83 [2018-05-20 155504].wav", \hhopen_83],
      ["chime high pitch ring_D.wav", \chime_ring_d],
      ["spinny-pluck_L6_sfx [2018-05-27 133232].wav", 'spinny-pluck_L6_sfx'],
      [
        "spinny-pluck_L4_chords-1 [2018-07-07 122629].wav",
        'spinny-pluck_L4_chords-1'
      ],
      [
        "spinny-pluck_L4_chords-2 [2018-07-07 122628].wav",
        'spinny-pluck_L4_chords-2'
      ],
      [
        "spinny-pluck_L4_chords-3 [2018-07-07 122629].wav",
        'spinny-pluck_L4_chords-3'
      ],
      [
        "spinny-pluck_L4_chords-4 [2018-07-07 122629].wav",
        'spinny-pluck_L4_chords-4'
      ], [
        "eerie_exit_15bars [2018-07-08 173939].wav",
        'spinny-pluck_idle-L6'
      ], [
        "spinny-pluck_L6-L4.wav",
        'spinny-pluck_L6-L4'
      ], [
        "spinny-pluck_L4-L2_5bar [2018-08-03 180721].wav",
        'spinny-pluck_L4-L2'
      ],
      ["spinny-pluck_L2_chords-1 [2018-08-03 182411].wav",
      'spinny-pluck_L2_chords-1'],
      ["spinny-pluck_L2_chords-2 [2018-08-03 182411].wav",
      'spinny-pluck_L2_chords-2'],
      ["spinny-pluck_L2_chords-3 [2018-08-03 182410].wav",
      'spinny-pluck_L2_chords-3'],
      ["spinny-pluck_L2_chords-4 [2018-08-03 182410].wav",
      'spinny-pluck_L2_chords-4'],
      [
        "spinny-pluck_L2-reveal.wav",
        'spinny-pluck_L2-reveal'
      ], [
        "spinny-pluck_reveal-55bar.wav",
        'spinny-pluck_reveal'
      ],
      [
        "eerie_idle_loop.wav",
        'eerie_idle_loop'
      ],
      [
        "eminator_floortom_01 [2019-03-23 192053].aif",
        'eminator_floortom_01'
      ],
      [
        "eminator_hat_closed_01 [2019-03-23 192053].aif",
        'eminator_hat_closed_01'
      ],
      [
        "eminator_hat_open_01 [2019-03-23 192053].aif",
        'eminator_hat_open_01'
      ],
      [
        "eminator_hightom_01 [2019-03-23 192053].aif",
        'eminator_hightom_01'
      ],
      [
        "eminator_kick_01 [2019-03-23 192053].aif",
        'eminator_kick_01'
      ],
      [
        "eminator_snare_01 [2019-03-23 192053].aif",
        'eminator_snare_01'
      ],
      [
        "eminator_snareroll_01 [2019-03-23 192053].aif",
        'eminator_snareroll_01'
      ],
			["sharp_eerie/eerie_L6_01 [2019-05-10 104045]_mono.aif", \sharp_eerie_01],
			["sharp_eerie/eerie_L6_02 [2019-05-10 104045]_mono.aif", \sharp_eerie_02],
			["sharp_eerie/eerie_L6_03 [2019-05-10 104045]_mono.aif", \sharp_eerie_03],
			["sharp_eerie/eerie_L6_04 [2019-05-10 104045]_mono.aif", \sharp_eerie_04],
			["sharp_eerie/eerie_L6_05 [2019-05-10 104045]_mono.aif", \sharp_eerie_05],
			["sharp_eerie/eerie_L6_06 [2019-05-10 104045]_mono.aif", \sharp_eerie_06],
			["sharp_eerie/eerie_L6_07 [2019-05-10 104045]_mono.aif", \sharp_eerie_07],
			["sharp_eerie/eerie_L6_08 [2019-05-10 104045]_mono.aif", \sharp_eerie_08],
			["sharp_eerie/eerie_L6_09 [2019-05-10 104045]_mono.aif", \sharp_eerie_09]
    ], ({
      // when buffers are done loading
      // load midi files
      bufManager.load_midi([
        (
          midiFileName: "spinny-pluck_L6_hats.mid",
          midiKey: 'spinny-pluck_L6_hats',
          makeDuration: 8 * 4,
          tempoBPM: OWAConstants.tempoBySongId['spinny_pluck']
        ),
        (
          midiFileName: "spinny-pluck_L2_hats.mid",
          midiKey: 'spinny-pluck_L2_hats',
          makeDuration: 8 * 4,
          tempoBPM: OWAConstants.tempoBySongId['spinny_pluck']
        ),
        (
          midiFileName: "spinny-pluck_L6_lead.mid",
          midiKey: 'spinny-pluck_L6_lead',
          makeDuration: 4 * 4,
          tempoBPM: OWAConstants.tempoBySongId['spinny_pluck']
        ),
        (
          midiFileName: "spinny-pluck_L2_lead.mid",
          midiKey: 'spinny-pluck_L2_lead',
          makeDuration: 4 * 4,
          tempoBPM: OWAConstants.tempoBySongId['spinny_pluck']
        ),
        (
          midiFileName: "eminator_bass_L2.mid",
          midiKey: 'eminator_bass_L2',
          makeDuration: 2 * 4,
          ccsToEnv: [15, 16],
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        ),
        (
          midiFileName: "eminator_bass_L4_quant.mid",
          midiKey: 'eminator_bass_L4',
          makeDuration: 16 * 4,
          ccsToEnv: [15, 16],
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        ),
        (
          midiFileName: "eminator_bass_L6_quant.mid",
          midiKey: 'eminator_bass_L6',
          makeDuration: 4 * 7,
          ccsToEnv: [15, 16],
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        ),
        (
          midiFileName: "eminator_L2_hats.mid",
          midiKey: 'eminator_hats_L2',
          makeDuration: 8 * 4,
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        ),
        (
          midiFileName: "eminator_L4_hats.mid",
          midiKey: 'eminator_hats_L4',
          makeDuration: 8 * 4,
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        ),
        (
          midiFileName: "eminator_L6_hats.mid",
          midiKey: 'eminator_hats_L6',
          makeDuration: 2 * 7,
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        ),
        (
          midiFileName: "eminator_kick_L2.mid",
          midiKey: 'eminator_kick_L2',
          makeDuration: 8 * 4,
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        ),
        (
          midiFileName: "eminator_kick_L4.mid",
          midiKey: 'eminator_kick_L4',
          makeDuration: 8 * 4,
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        ),
        (
          midiFileName: "eminator_kick_L6.mid",
          midiKey: 'eminator_kick_L6',
          makeDuration: 2 * 7,
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        ),
        (
          midiFileName: "eminator_snare_L2.mid",
          midiKey: 'eminator_snare_L2',
          makeDuration: 8 * 4,
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        ),
        (
          midiFileName: "eminator_snare_L4.mid",
          midiKey: 'eminator_snare_L4',
          makeDuration: 8 * 4,
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        ),
        (
          midiFileName: "eminator_snare_L6.mid",
          midiKey: 'eminator_snare_L6',
          makeDuration: 2 * 7,
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        )
      ]);

      sampleManager = OWASampleManager.new((
        bufManager: bufManager,
        soundsDir: "SOUNDS_DIRECTORY_PATH".getenv(),
        onDoneLoading: {
          // initialize sequencers
          seqFactory.setStore(store);

          // initialize idle player
          idlePlayer = IdlePlayer.new((
            store: store,
            bufManager: bufManager,
            clock: clockController.clock
          ));

          // tell main process we are done
          store.dispatch((
            type: "OWA_SOUND_INIT_DONE"
          ));
        }
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
