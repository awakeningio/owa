EminatorHatsInstrument {
  var bufManager, <patch, <pattern,
    acousticOpenProvider,
    acousticClosedProvider,
    electronicOpenProvider,
    electronicClosedProvider,
    clock;
  *new {
    arg params;
    ^super.new().init(params);
  }
  *getSampleProviderMetadatasToLoadList {
    ^[
      'acoustic_hat',
      'acoustic_hat_open',
      'electronic_hat',
      'electronic_hat_open'
    ].collect({
      arg voiceName;

      (
        name: voiceName,
        metadataFilePath: voiceName.asString() ++ ".json",
        class: PercussionVoiceSampleManager
      );
    });
  }
  init {
    arg params;
    var synthdef;

    bufManager = params['bufManager'];
    clock = params['clock'];

    acousticOpenProvider = bufManager.getSampleProvider('acoustic_hat_open');
    acousticClosedProvider = bufManager.getSampleProvider('acoustic_hat');
    electronicOpenProvider = bufManager.getSampleProvider('electronic_hat_open');
    electronicClosedProvider = bufManager.getSampleProvider('electronic_hat');

    patch = Patch("owa.EminatorHiHat", (
      velocity: KrNumberEditor(0, [0, 127]),
      gate: KrNumberEditor(1, \gate),
      amp: KrNumberEditor(-11.0.dbamp(), \amp),
      openHat: KrNumberEditor(0, [0, 1]),
      sustainTime: KrNumberEditor(1, [0, 100]),
      acousticClosedStartTimes: acousticClosedProvider.startTimesBuf.bufnum,
      acousticOpenStartTimes: acousticOpenProvider.startTimesBuf.bufnum,
      electronicClosedStartTimes: electronicClosedProvider.startTimesBuf.bufnum,
      electronicOpenStartTimes: electronicOpenProvider.startTimesBuf.bufnum,
      sustained: false
    ));
    patch.gate.lag = 0;
    synthdef = patch.asSynthDef().add();

    pattern = Pbind(
      \instrument, synthdef.name,
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
      \acousticClosedSample, acousticClosedProvider.sampleBufnumPattern(),
      \electronicClosedSample, electronicClosedProvider.sampleBufnumPattern(),
      \acousticOpenSample, acousticOpenProvider.sampleBufnumPattern(),
      \electronicOpenSample, electronicOpenProvider.sampleBufnumPattern()
    );
  }

  updateForSessionPhase {
    arg sessionPhase;
    var hatsMidiKey;

    hatsMidiKey = switch(sessionPhase,
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

  }
  updatePropQuant {
    arg quant;

    Pdefn('EminatorHatsEtcSequencerNotes').quant = quant;
  }
}
