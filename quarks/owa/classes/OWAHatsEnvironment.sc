OWAHatsEnvironment : VoicerEnvironmentComponent {
  init {
    arg params;

    var voicer,
      sock,
      percussionKitSampleManager = params['percussionKitSampleManager'];

    params['numVoices'] = 1;
    params['instr'] = Instr("owa.EminatorHiHat");
    params['instrArgs'] = [
      \acousticClosedStartTimes, percussionKitSampleManager.getVoiceSampleManager('acoustic_hat').startTimesBuf.bufnum,
      \acousticOpenStartTimes, percussionKitSampleManager.getVoiceSampleManager('acoustic_hat_open').startTimesBuf.bufnum,
      \electronicClosedStartTimes, percussionKitSampleManager.getVoiceSampleManager('electronic_hat').startTimesBuf.bufnum,
      \electronicOpenStartTimes, percussionKitSampleManager.getVoiceSampleManager('electronic_hat_open').startTimesBuf.bufnum,
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
      \acousticClosedSample, percussionKitSampleManager.getVoiceSampleManager('acoustic_hat').sampleBufnumPattern(),
      \electronicClosedSample, percussionKitSampleManager.getVoiceSampleManager('electronic_hat').sampleBufnumPattern(),
      \acousticOpenSample, percussionKitSampleManager.getVoiceSampleManager('acoustic_hat_open').sampleBufnumPattern(),
      \electronicOpenSample, percussionKitSampleManager.getVoiceSampleManager('electronic_hat_open').sampleBufnumPattern()
    );
  }
}
