OWAPercussionKitSampleManager : PercussionKitSampleManager {
  *new {
    arg params;
    var bufManager = params['bufManager'],
      soundsDir = params['soundsDir'],
      onDoneLoading = params['onDoneLoading'];
    ^super.new((
      bufManager: bufManager,
      voices: [
        (
          name: 'acoustic_kick',
          metadataFilePath: soundsDir +/+ "acoustic_kick_sampled.json" 
        ),
        (
          name: 'electronic_snare',
          metadataFilePath: soundsDir +/+ "electronic_snare.json"
        ),
        (
          name: 'acoustic_snare',
          metadataFilePath: soundsDir +/+ "acoustic_snare.json"
        )
      ],
      onDoneLoading: onDoneLoading
    ));
  }
}
