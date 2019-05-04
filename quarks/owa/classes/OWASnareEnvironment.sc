OWASnareEnvironment : VoicerEnvironmentComponent {
  init {
    arg params;

    var voicer,
      percussionKitSampleManager = params['percussionKitSampleManager'],
      acousticSnareSampleManager,
      electronicSnareSampleManager;

    electronicSnareSampleManager = percussionKitSampleManager.getVoiceSampleManager('electronic_snare');
    acousticSnareSampleManager = percussionKitSampleManager.getVoiceSampleManager('acoustic_snare');

    params['numVoices'] = 1;
    params['instr'] = Instr("owa.EminatorSnare");
    params['instrArgs'] = [
      \electronicStartTimesBufnum, electronicSnareSampleManager.startTimesBuf.bufnum,
      \acousticStartTimesBufnum, acousticSnareSampleManager.startTimesBuf.bufnum
    ];
    super.init(params);

    this.sock.lowkey = "D1".notemidi();
    this.sock.hikey = "D1".notemidi();
    this.sock.noteOnArgsPat = Pbind(
      \electronicSampleBufnum, electronicSnareSampleManager.sampleBufnumPattern(),
      \acousticSampleBufnum, acousticSnareSampleManager.sampleBufnumPattern()
    );
  }
}
