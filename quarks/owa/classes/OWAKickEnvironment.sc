OWAKickEnvironment : VoicerEnvironmentComponent {
  init {
    arg params;

    var voicer,
      sock,
      soundsDir = params['soundsDir'],
      vileKickInstr = Instr("owa.OWAKick"),
      vileKickSpecs = vileKickInstr.specs,
      gui,
      acousticKickSamplerManager,
      acousticKickDone;

    acousticKickDone = {

      params['numVoices'] = 10;
      params['instr'] = Patch("owa.OWAKick", (
        acousticBufnums: acousticKickSamplerManager.bufnums,
        acousticStartTimesByVelocity: acousticKickSamplerManager.startTimesByVelocity
      )).asSynthDef().add().name;
      //params['instrArgs'] = [
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
