OWACompositionEnvironment {
  classvar <>instance;
  *new {
    ^super.new().init();
  }
  *start {
    arg params;
    if (this.instance != nil, {
      "OWACompositionEnvironment already started".throw();    
    }, {
      this.instance = OWACompositionEnvironment.new(params);
    });
    ^this.instance;
  }
  init {
    arg params;

    var clock,
      owaKickEnvironment,
      owaSnareEnvironment,
      owaBassEnvironment,
      owaHatsEnvironment,
      soundsDir = "SOUNDS_DIRECTORY_PATH".getenv(),
      bufManager,
      percussionKitSampleManager;

    Server.default.latency = 0.1;
    clock = LinkClock();

    bufManager = BufferManager.new((
      rootDir: soundsDir
    ));

    bufManager.load_sample_providers_from_metadata(
      EminatorKickSnareInstrument.getSampleProviderMetadatasToLoadList()
      ++ EminatorHatsInstrument.getSampleProviderMetadatasToLoadList(),
      {
        owaKickEnvironment = OWAKickEnvironment.new((
          inChannel: 6,
          outputBus: 24,
          bufManager: bufManager
        ));
        owaSnareEnvironment = OWASnareEnvironment.new((
          inChannel: 7,
          outputBus: 26,
          bufManager: bufManager
        ));
        owaBassEnvironment = OWABassVoicerEnvironment.new((
          inChannel: 5,
          outputBus: 28
        ));
        owaHatsEnvironment = OWAHatsEnvironment.new((
          inChannel: 8,
          outputBus: 30,
          bufManager: bufManager
        ));
      }
    );

    ^this;  
  }
}
