SpinnyHatsInstrument {
  var bufManager, <patch, <pattern, clock, openSampleProvider, closedSampleProvider;
  *new {
    arg params;
    ^super.new().init(params);
  }
  *getSampleProviderMetadatasToLoadList {
    ^[
      'distorted_hat_closed',
      'distorted_hat_open'
    ].collect({
      arg voiceName;

      (
        name: voiceName,
        metadataFilePath: voiceName.asString() ++ ".json",
        class: PercussionVoiceSampleManager
      );
    });
  }
  *getMidiToLoadList {
    ^[
      (
        midiFileName: "spinny-pluck_L2_hats.mid",
        midiKey: 'spinny-pluck_L2_hats',
        makeDuration: 8 * 4,
        tempoBPM: OWAConstants.tempoBySongId['spinny_pluck']
      )
    ];
  }
  init {
    arg params;
    var synthdef;

    bufManager = params['bufManager'];
    clock = params['clock'];

    
  }
}
