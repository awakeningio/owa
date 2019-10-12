OWASnareEnvironment : VoicerEnvironmentComponent {
  init {
    arg params;

    var voicer,
      bufManager = params['bufManager'],
      acousticSnareSampleManager,
      electronicSnareSampleManager;

    electronicSnareSampleManager = bufManager.getSampleProvider('electronic_snare');
    acousticSnareSampleManager = bufManager.getSampleProvider('acoustic_snare');

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
