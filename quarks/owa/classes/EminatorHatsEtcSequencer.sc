EminatorHatsEtcSequencer : AwakenedSequencer {
  var hatsSynthdef,
    lastSessionPhase;

  initPatch {
    var patch;
    patch = Patch("owa.EminatorHiHat", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-11.0.dbamp(), \amp),
      openHat: KrNumberEditor(0, [0, 1]),
      sustainTime: KrNumberEditor(1, [0, 100]),
      acousticClosedStartTimes: bufManager.getSampleProvider('acoustic_hat').startTimesBuf.bufnum,
      acousticOpenStartTimes: bufManager.getSampleProvider('acoustic_hat_open').startTimesBuf.bufnum,
      electronicClosedStartTimes: bufManager.getSampleProvider('electronic_hat').startTimesBuf.bufnum,
      electronicOpenStartTimes: bufManager.getSampleProvider('electronic_hat_open').startTimesBuf.bufnum,
      sustained: false
    ));
    patch.gate.lag = 0;
    hatsSynthdef = patch.asSynthDef().add();
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
      \acousticClosedSample, bufManager.getSampleProvider('acoustic_hat').sampleBufnumPattern(),
      \electronicClosedSample, bufManager.getSampleProvider('electronic_hat').sampleBufnumPattern(),
      \acousticOpenSample, bufManager.getSampleProvider('acoustic_hat_open').sampleBufnumPattern(),
      \electronicOpenSample, bufManager.getSampleProvider('electronic_hat_open').sampleBufnumPattern()
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
