SpinnyKickInstrument {
  var bufManager,
    <pattern,
    acousticKickSampleProvider;
  *new {
    arg params;
    ^super.new().init(params);
  }
  *getSampleProviderMetadatasToLoadList {
    ^[
      (
        name: 'acoustic_kick',
        metadataFilePath: "acoustic_kick.json",
        class: PercussionVoiceSampleManager
      )
    ]
  }
}
