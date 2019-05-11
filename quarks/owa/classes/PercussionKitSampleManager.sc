PercussionKitSampleManager {
  var voiceSampleManagers,
    voiceSampleManagersByName;
  *new {
    arg params;
    ^super.new.init(params);
  }

  init {
    arg params;

    var bufManager = params['bufManager'],
      voices = params['voices'],
      onDoneLoading = params['onDoneLoading'],
      isVoiceLoadedByName = Dictionary.new();

    voiceSampleManagers = Array.new();
    voiceSampleManagersByName = Dictionary.new();

    // Iterates through each voice, initialising isVoiceLoadedByName to false
    // for each voice.
    voices.do({
      arg voiceInfo;

      isVoiceLoadedByName[voiceInfo['name'].asSymbol()] = false;
    });

    // Iterates through each voice, instantiating a
    // `PercussionVoiceSampleManager` and tracking when the samples
    // are finished loading.
    voices.do({
      arg voiceInfo;

      var voiceName = voiceInfo['name'].asSymbol(),
        voiceSampleManager,
        sampleManagerClass;

      sampleManagerClass = voiceInfo['sampleManagerClass'];

      voiceSampleManager = sampleManagerClass.new((
        bufManager: bufManager,
        metadataFilePath: voiceInfo['metadataFilePath'],
        onDoneLoading: {
          var isStillLoading;

          isVoiceLoadedByName[voiceName] = true;

          isStillLoading = voices.any({
            arg voiceInfo;
            var voiceName = voiceInfo['name'].asSymbol();
            isVoiceLoadedByName[voiceName] == false;
          });

          if (isStillLoading == false, {
            onDoneLoading.value();
          });
        }
      ));
      voiceSampleManagersByName[voiceName] = voiceSampleManager;
      voiceSampleManagers.add(voiceSampleManager);
    });
  }

  getVoiceSampleManager {
    arg name;
    ^voiceSampleManagersByName[name];
  }
}
