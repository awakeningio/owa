OWAHatsEnvironment : VoicerEnvironmentComponent {
  init {
    arg params;

    var voicer,
      sock,
      bufManager = params['bufManager'];

    params['numVoices'] = 1;
    params['instr'] = Instr("owa.EminatorHiHat");
    params['instrArgs'] = [
      \acousticClosedStartTimes, bufManager.getSampleProvider('acoustic_hat').startTimesBuf.bufnum,
      \acousticOpenStartTimes, bufManager.getSampleProvider('acoustic_hat_open').startTimesBuf.bufnum,
      \electronicClosedStartTimes, bufManager.getSampleProvider('electronic_hat').startTimesBuf.bufnum,
      \electronicOpenStartTimes, bufManager.getSampleProvider('electronic_hat_open').startTimesBuf.bufnum,
      \sustained, true
    ];

    super.init(params);

    this.sock.lowkey = "A0".notemidi();
    this.sock.hikey = "B0".notemidi();
    this.sock.noteOnArgsPat = Pbind(
      \openHat, Pfunc({
        arg e;

        if (e[\midinote] == 9, {
          1    
        }, {
          0
        });
      }),
      \acousticClosedSample, bufManager.getSampleProvider('acoustic_hat').sampleBufnumPattern(),
      \electronicClosedSample, bufManager.getSampleProvider('electronic_hat').sampleBufnumPattern(),
      \acousticOpenSample, bufManager.getSampleProvider('acoustic_hat_open').sampleBufnumPattern(),
      \electronicOpenSample, bufManager.getSampleProvider('electronic_hat_open').sampleBufnumPattern()
    );
  }
}
