OWAKickEnvironment : VoicerEnvironmentComponent {
  init {
    arg params;

    var voicer,
      sock,
      soundsDir = params['soundsDir'],
      gui,
      acousticKickSamplerManager,
      acousticKickDone;

    acousticKickDone = {
      
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

    };
    
    acousticKickSamplerManager = AcousticKickSamplerManager.new((
      bufManager: params['bufManager'],
      metadataFilePath: soundsDir +/+ "acoustic_kick_sampled.json",
      onDoneLoading: acousticKickDone
    ));
  

  }
}
