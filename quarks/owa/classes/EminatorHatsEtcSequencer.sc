EminatorHatsEtcSequencer : AwakenedSequencer {
  var hatsSynthdef;

  initPatch {
    var sampleManager = OWASampleManager.getInstance();
    hatsSynthdef = Patch("owa.EminatorHiHat", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-11.0.dbamp(), \amp),
      openHat: KrNumberEditor(0, [0, 1]),
      sustainTime: KrNumberEditor(1, [0, 100]),
      acousticClosedStartTimes: sampleManager.getVoiceSampleManager('acoustic_hat').startTimesBuf.bufnum,
      acousticOpenStartTimes: sampleManager.getVoiceSampleManager('acoustic_hat_open').startTimesBuf.bufnum,
      electronicClosedStartTimes: sampleManager.getVoiceSampleManager('electronic_hat').startTimesBuf.bufnum,
      electronicOpenStartTimes: sampleManager.getVoiceSampleManager('electronic_hat_open').startTimesBuf.bufnum,
      sustained: false
    )).asSynthDef().add();
  }

  initStream {
    var sampleManager = OWASampleManager.getInstance();
    ^Pbind(
      \instrument, hatsSynthdef.name,
      [\midinote, \dur], Pseq(bufManager.midiSequences['eminator_hats_L6'], inf),
      \openHat, Pfunc({
        arg e;

        //"e[\midinote]:".postln;
        //e[\midinote].postln;

        if (e[\midinote] == 9, {
          1    
        }, {
          0
        });
      }),
      \sustainTime, Pfunc({
        arg e;
        (e[\dur] / clock.tempo);
      }),
      \acousticClosedSample, sampleManager.getVoiceSampleManager('acoustic_hat').sampleBufnumPattern(),
      \electronicClosedSample, sampleManager.getVoiceSampleManager('electronic_hat').sampleBufnumPattern(),
      \acousticOpenSample, sampleManager.getVoiceSampleManager('acoustic_hat_open').sampleBufnumPattern(),
      \electronicOpenSample, sampleManager.getVoiceSampleManager('electronic_hat_open').sampleBufnumPattern()
    ).asStream();
  }
}
