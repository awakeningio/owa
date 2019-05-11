EminatorCrazyVoicesSequencer : AwakenedSequencer {
  var synthdef;
  initPatch {
    var patch = Patch("owa.eminator.CrazyVoices", (
      gate: KrNumberEditor(1, \gate),
      freq: KrNumberEditor(440, \freq),
      amp: KrNumberEditor(1.0, \amp),
      phasingAmt: KrNumberEditor(0.0, \unipolar)
    ));
    synthdef = patch.asSynthDef().add();
    ^patch;
  }

  initStream {
    ^Pbind(
      \instrument, synthdef.name,
      //\degree, Pseq([0, 5, 3, 8, 7, 0, 7, 5], inf),
      \degree, Pseq([0, 7, 2, 0, 7, 0, 2, 2], inf),
      \scale, Scale.minor,
      \octave, Prand([1, 2, 6, 7], inf),
      // D
      \mtranspose, 2,
      //\dur, Prand([0.5, Rest(0.5)], inf),
      \dur, Prand([0.25, Rest(0.25), 0.5, Rest(0.5)], inf),
      \amp, -5.0.dbamp(),
      \vibratoSpeed, clock.tempo * 4,
      \vibratoDepth, 2, // in semitones
      \vowel, Prand([0, 1, 2, 3, 4], inf),
      \phasingAmt, 0.0,
      //\phasingAmt, Prand([0.0, 0.5, 1.0], inf),
      \legato, 1.0,
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

}
