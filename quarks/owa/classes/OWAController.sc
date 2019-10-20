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
    idlePlayer;


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
    

    bufManager.load_bufs(([
      ["kick_01 [2018-05-20 115711].wav", \kick_01],
      ["hhclosed_96 [2018-05-20 155504].wav", \hhclosed_96],
      ["hhopen_83 [2018-05-20 155504].wav", \hhopen_83],
      ["chime high pitch ring_D.wav", \chime_ring_d],
      ["spinny-pluck_L6_sfx [2018-05-27 133232].wav", 'spinny-pluck_L6_sfx'],
      [
        "spinny-pluck_L4_chords-1 [2018-07-07 122629]_mono.wav",
        'spinny-pluck_L4_chords-1'
      ],
      [
        "spinny-pluck_L4_chords-2 [2018-07-07 122628]_mono.wav",
        'spinny-pluck_L4_chords-2'
      ],
      [
        "spinny-pluck_L4_chords-3 [2018-07-07 122629]_mono.wav",
        'spinny-pluck_L4_chords-3'
      ],
      [
        "spinny-pluck_L4_chords-4 [2018-07-07 122629]_mono.wav",
        'spinny-pluck_L4_chords-4'
      ], 
      ["spinny-pluck_L2_chords-1 [2018-08-03 182411]_mono.wav",
      'spinny-pluck_L2_chords-1'],
      ["spinny-pluck_L2_chords-2 [2018-08-03 182411]_mono.wav",
      'spinny-pluck_L2_chords-2'],
      ["spinny-pluck_L2_chords-3 [2018-08-03 182410]_mono.wav",
      'spinny-pluck_L2_chords-3'],
      ["spinny-pluck_L2_chords-4 [2018-08-03 182410]_mono.wav",
      'spinny-pluck_L2_chords-4'],

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
        "eminator_snareroll_01 [2019-03-23 192053].aif",
        'eminator_snareroll_01'
      ],
      ["eminator-chords/render chords L2 01 [2019-05-19 204530]__mono.wav", \eminator_chords_L2_01],
      ["eminator-chords/render chords L2 02 [2019-05-19 204530]__mono.wav", \eminator_chords_L2_02],
      ["eminator-chords/render chords L2 03 [2019-05-19 204530]__mono.wav", \eminator_chords_L2_03],
      ["eminator-chords/render chords L2 04 [2019-05-19 204530]__mono.wav", \eminator_chords_L2_04],
      ["eminator-chords/render chords L4 01 [2019-05-19 204530]__mono.wav", \eminator_chords_L4_01],
      ["eminator-chords/render chords L4 02 [2019-05-19 204530]__mono.wav", \eminator_chords_L4_02],
      ["eminator-chords/render chords L4 03 [2019-05-19 204530]__mono.wav", \eminator_chords_L4_03],
      ["eminator-chords/render chords L4 04 [2019-05-19 204530]__mono.wav", \eminator_chords_L4_04],

    ]
    ++ EminatorSharpEerieInstrument.getBufsToLoadList()
  ), ({
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
          midiFileName: "eminator_bass_L6-01.mid",
          midiKey: 'eminator_bass_L6_01',
          makeDuration: 4 * 7,
          ccsToEnv: [15, 16],
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        ),
        (
          midiFileName: "eminator_bass_L6-02.mid",
          midiKey: 'eminator_bass_L6_02',
          makeDuration: 4 * 7,
          ccsToEnv: [15, 16],
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        ),
        (
          midiFileName: "eminator_bass_L6-03.mid",
          midiKey: 'eminator_bass_L6_03',
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
          midiFileName: "eminator_snare_L6.mid",
          midiKey: 'eminator_snare_L6',
          makeDuration: 2 * 7,
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        ),
        (
          midiFileName: "eminator_lead_L2.mid",
          midiKey: 'eminator_lead_L2',
          makeDuration: 4 * 16,
          tempoBPM: OWAConstants.tempoBySongId['eminator']
        )
      ] ++ EminatorKickSnareInstrument.getMidiToLoadList());

      bufManager.cue_bufs([
        (
          relativeFilePath: "eerie_idle_loop_mono_adjusted.wav",
          bufferKey: 'eerie_idle_loop',
          numChannels: 1
        ),
        (
          relativeFilePath: "eerie_exit_15bars [2018-07-08 173939]_mono.wav",
          bufferKey: 'spinny-pluck_idle-L6',
          numChannels: 1
        ),
        (
          relativeFilePath: "spinny-pluck_L6-L4_mono.wav",
          bufferKey: 'spinny-pluck_L6-L4',
          numChannels: 1
        ),
        (
          relativeFilePath: "spinny-pluck_L4-L2_5bar [2018-08-03 180721]_mono.wav",
          bufferKey: 'spinny-pluck_L4-L2',
          numChannels: 1
        ),
        (
          relativeFilePath: "spinny-pluck_L2-reveal_mono.wav",
          bufferKey: 'spinny-pluck_L2-reveal',
          numChannels: 1
        ),
        (
          relativeFilePath: "spinny-pluck_reveal-55bar_mono.wav",
          bufferKey: 'spinny-pluck_reveal',
          numChannels: 1
        ),
        (
          relativeFilePath: "eminator_trans_L2-Reveal_mono.wav",
          bufferKey: \eminator_trans_L2_reveal,
          numChannels: 1
        ),
        (
          relativeFilePath: "eminator_trans_L4-L2_mono.wav",
          bufferKey: \eminator_trans_L4_L2,
          numChannels: 1
        ),
        (
          relativeFilePath: "eminator_trans_L6-L4_mono.wav",
          bufferKey: \eminator_trans_L6_L4,
          numChannels: 1
        ),
        (
          relativeFilePath: "eminator_trans_idle_mono.wav",
          bufferKey: \eminator_trans_idle,
          numChannels: 1
        ),
        (
          relativeFilePath: "eminator_reveal_mono.wav",
          bufferKey: \eminator_reveal,
          numChannels: 1
        )
      ]);

      bufManager.load_sample_providers_from_metadata(
        EminatorKickSnareInstrument.getSampleProviderMetadatasToLoadList()
        ++ EminatorHatsInstrument.getSampleProviderMetadatasToLoadList()
        ++ EminatorWubBuzzInstrument.getSampleProviderMetadatasToLoadList()
        ++ [
          // TODO move these to their respective instruments
          'high-pop',
          'lead'
        ].collect({
          arg voiceName;
          (
            name: voiceName,
            metadataFilePath: voiceName.asString() ++ ".json",
            class: PitchedVoiceSampleManager
          );
        }),
        {
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
      );
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
