OWAKickEnvironment : VoicerEnvironmentComponent {
  init {
    arg params;

    var voicer,
      sock,
      soundsDir = params['soundsDir'],
      vileKickInstr = Instr("owa.SyntheticKick"),
      vileKickSpecs = vileKickInstr.specs,
      gui,
      acousticKickSamplerManager,
      acousticKickDone;

    acousticKickDone = {

      params['numVoices'] = 1;
      params['instr'] = vileKickInstr;
      //params['instrArgs'] = [
        //\acousticBufnums, acousticKickSamplerManager.bufnums,
        //\acousticStartTimesByVelocity, acousticKickSamplerManager.startTimesByVelocity
      //];

      super.init(params);
      
      this.sock.lowkey = "C0".notemidi();
      this.sock.hikey = "C2".notemidi();

    };
    
    acousticKickSamplerManager = AcousticKickSamplerManager.new((
      bufManager: params['bufManager'],
      metadataFilePath: soundsDir +/+ "acoustic_kick_sampled.json",
      onDoneLoading: acousticKickDone
    ));
  

  }
}
