OWAKickEnvironment : VoicerEnvironmentComponent {
  init {
    arg params;

    var voicer,
      sock,
      percussionKitSampleManager = params['percussionKitSampleManager'],
      gui,
      acousticKickSamplerManager;

    acousticKickSamplerManager = percussionKitSampleManager.getVoiceSampleManager('acoustic_kick');
    params['numVoices'] = 1;
    params['instr'] = Instr("owa.EminatorKick");
    params['instrArgs'] = [
      \acousticStartTimesBufnum, acousticKickSamplerManager.startTimesBuf.bufnum
    ];
    ////params['noteOnPat'] = ;

    super.init(params);
    
    this.sock.lowkey = "C0".notemidi();
    this.sock.hikey = "C2".notemidi();
    this.sock.noteOnArgsPat = Pbind(
      \acousticSampleBufnum, acousticKickSamplerManager.sampleBufnumPattern(),
    );
  }
}
