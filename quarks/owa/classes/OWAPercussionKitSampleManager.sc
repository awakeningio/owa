OWAPercussionKitSampleManager : PercussionKitSampleManager {
  *new {
    arg params;
    var bufManager = params['bufManager'],
      soundsDir = params['soundsDir'],
      onDoneLoading = params['onDoneLoading'],
      voices;

    voices = [
      'acoustic_kick',
      'electronic_snare',
      'acoustic_snare',
      'acoustic_hat',
      'acoustic_hat_open',
      'electronic_hat',
      'electronic_hat_open'
    ].collect({
      arg voiceName;

      (
        name: voiceName,
        metadataFilePath: soundsDir +/+ voiceName.asString() ++ ".json",
        sampleManagerClass: PercussionVoiceSampleManager
      );
    });

    voices = voices ++ [
      'wub-buzz-slices'
    ].collect({
      arg voiceName;
      (
        name: voiceName,
        metadataFilePath: soundsDir +/+ voiceName.asString() ++ ".json",
        sampleManagerClass: SlicedVoiceSampleManager
      );
    });

    ^super.new((
      bufManager: bufManager,
      voices: voices,
      onDoneLoading: onDoneLoading
    ));
  }
}
