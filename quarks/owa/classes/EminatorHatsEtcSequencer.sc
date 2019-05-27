EminatorHatsEtcSequencer : AwakenedSequencer {
  var hatsSynthdef,
    lastSessionPhase;

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

  updateNotes {

    var state = store.getState();
    var hatsMidiKey;

    hatsMidiKey = switch(state.sessionPhase.asSymbol(),
      \QUEUE_TRANS_6, {
        'eminator_hats_L6';
      },
      \TRANS_4, {
        'eminator_hats_L4';
      },
      \TRANS_2, {
        'eminator_hats_L2';
      }
    );

    if (hatsMidiKey != nil, {
      Pdefn(
        'EminatorHatsEtcSequencerNotes',
        Pseq(bufManager.midiSequences[hatsMidiKey], inf)
      );
    });

    Pdefn('EminatorHatsEtcSequencerNotes').quant = currentState.playQuant;
  }

  initStream {
    var sampleManager = OWASampleManager.getInstance();

    ^Pbind(
      \instrument, hatsSynthdef.name,
      [\midinote, \dur], Pdefn('EminatorHatsEtcSequencerNotes'),
      \openHat, Pfunc({
        arg e;

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

  handleStateChange {
    var state = store.getState();
    var sessionPhase = state.sessionPhase.asSymbol();
    
    super.handleStateChange();

    if (lastSessionPhase !== sessionPhase, {
      this.updateNotes();
      lastSessionPhase = sessionPhase;
    });
  }
}
