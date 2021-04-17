EminatorCrazyVoicesSequencer : SCReduxSequencer {
  var synthdef,
    lastSessionPhase;
  initPatch {
    var patch = Patch("owa.eminator.CrazyVoices", (
      gate: KrNumberEditor(1, \gate),
      freq: KrNumberEditor(440, \freq),
      amp: KrNumberEditor(-4.0.dbamp(), \amp),
      phasingAmt: KrNumberEditor(0.0, \unipolar)
    ));
    patch.gate.lag = 0;
    synthdef = patch.asSynthDef().add();
    ^patch;
  }

  initStream {
    ^Pbind(
      \instrument, synthdef.name,
      //\degree, Pseq([0, 5, 3, 8, 7, 0, 7, 5], inf),
      \scale, Scale.minor,
      // D
      \mtranspose, 2,
      //\dur, Prand([0.5, Rest(0.5)], inf),
      //\dur, Prand([0.25, Rest(0.25), 0.5, Rest(0.5)], inf),
      [\dur, \legato, \degree, \octave], Pdefn('EminatorCrazyVoices'),
      \amp, Prand([-10.0.dbamp(), -12.0.dbamp()], inf),
      \vibratoSpeed, clock.tempo * 4,
      \vibratoDepth, 2, // in semitones
      \vowel, Prand([0, 1, 2, 3, 4], inf),
      \phasingAmt, 0.0,
      //\phasingAmt, Prand([0.0, 0.5, 1.0], inf),
      \att, 0.05,
      \rel, 0.25,
      //\filterFreq, Pfunc({
      //arg e;

      //e[\scale].degreeToFreq(
      //e[\degree],
      //"D2".notemidi().midicps(),
      //e[\octave]
      //);
      //})
    ).asStream();
  }

  useL6Variation {
    arg variationIndex;

    switch(variationIndex,
      0, {
        Pdefn(
          'EminatorCrazyVoices',
          Prand([
            Ptuple([
              // dur
              Pseq([1, Rest(6)], inf),
              // legato
              1.0,
              // degree
              Pseq([0, 7, 2, 0, 7, 0, 2, 2], inf),
              // octave
              Prand([1, 2, 3, 4], inf)
            ])
          ])
        );
      },
      1, {
        Pdefn(
          'EminatorCrazyVoices',
          Prand([
            Ptuple([
              // dur
              Prand([
                Pseq([1, Rest(6)]),
                Pseq([1, Rest(2), 1, Rest(2)]),
              ], inf),
              // legato
              Prand([0.75, 0.25], inf),
              // degree
              Pseq([0, 7, 2, 0, 7, 0, 2, 2], inf),
              // octave
              Prand([1, 2, 3, 4], inf)
            ])
          ])
        );
      },
      2, {
        Pdefn(
          'EminatorCrazyVoices',
          Prand([
            Ptuple([
              // dur
              Pwrand([
                Pseq([1, Rest(6)]),
                Pseq([1, Rest(2), 1, Rest(2)]),
                Pseq([Rest(0.5), 1, Rest(1), 1, 1, Rest(1.5)]),
              ], [
                1,
                2,
                3
              ].normalizeSum(),
              inf),
              // legato
              Pwrand([0.75, 0.5, 0.25], [1, 2, 3].normalizeSum(), inf),
              // degree
              Prand([0, 7, 2, 0, 7, 0, 2, 2], inf),
              // octave
              Prand([1, 2, 3, 4], inf)
            ])
          ])
        );
      },
      3, {
        Pdefn(
          'EminatorCrazyVoices',
          Prand([
            Ptuple([
              // dur
              Pwrand([
                Pseq([1, Rest(6)]),
                Pseq([1, Rest(2), 1, Rest(2)]),
                Pseq([1, Rest(1), 1, 1, Rest(2)]),
                Pseq([Rest(0.5), 1/2, Rest(1/2), Rest(1), 1/16, Rest(15/16), 1, Rest(1.5)]),
              ], [
                1,
                4,
                4,
                6
              ].normalizeSum(),
              inf),
              // legato
              Pwrand([0.75, 0.5, 0.25, 1/16], [1, 4, 6, 8].normalizeSum(), inf),
              // degree
              Prand([0, 7, 2, 0, 7, 0, 2, 2], inf),
              // octave
              Prand([1, 3, 4], inf)
            ])
          ])
        );
      }
    )
  }

  handleStateChange {
    var state = store.getState();
    var sessionPhase = state.sessionPhase.asSymbol();
    var lastVariationIndex = currentState.variationIndex;
    
    super.handleStateChange();

    if (lastSessionPhase !== sessionPhase, {
      switch(sessionPhase, 
        \QUEUE_TRANS_6, {
          this.useL6Variation(0);
        },
        \TRANS_4, {
          Pdefn(
            'EminatorCrazyVoices',
            Ptuple([
              // dur
              Prand([
                Pseq([1, Rest(3)]),
                Pseq([0.5, Rest(3.5)]),
                Pseq([Rest(4)]),
                Pseq([Rest(4)])
              ], inf),

              // legato
              1.0,

              // degree
              Pseq([0, 7, 2, 0, 7, 0, 2, 2], inf),
              // octave
              Prand([1, 2, 3, 4], inf)

            ], inf)
          );
        }
      );
      lastSessionPhase = sessionPhase;
    });
    
    Pdefn('EminatorCrazyVoices').quant = currentState.propQuant;
    if (lastVariationIndex !== currentState.variationIndex, {
      this.useL6Variation(currentState.variationIndex);    
    });
  }
}
