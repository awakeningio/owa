SimpleSequencer : AwakenedSequencer {
  var pat,
    //instr,
    patStream,
    patchSynth,
    releaseTime;

  initPatch {
    //instr = Instr(\paramexample, {
      //arg freq, amp = 1.0, modIndex = 0.5, releaseTime = 0.3;
      //var out, car, mod;
      //mod = SinOsc.ar(freq * modIndex);
      //car = SinOsc.ar(freq * mod, 0, amp);
      //out = car * EnvGen.kr(Env.linen(0.001, 0.05, releaseTime), doneAction: 2);
      //[out, out];
    //}, [
      //\freq,
      //\amp,
      //\lowfreq,
      //ControlSpec(0.1, 5.0, \lin)
    //]);
    //// define a simple synth
    //patch = Patch(\paramexample);
    patch = Patch("cs.percussion.Impulsive", (

      harms: [
        (
          ratio: 4.875,
          rq: 0.1
        ),
        (
          ratio: 2.5,
          rq: 0.1
        ),
        /*(
          ratio: 2,
          rq: 0.01
        ),*/
        /*(
          ratio: 1.875,
          rq: 0.08
        ),
        (
          ratio: 1.5,
          rq: 0.06
        ),*/
        (
          ratio: 1,
          rq: 0.09
        )
      ]
    ));
    //releaseTime = patch.releaseTime;
    //releaseTime.value = currentState.releaseTime;
    patch.prepareForPlay();
    patchSynth = patch.asSynthDef().add();
    ^patch
  }

  initStream {
    var dur = List.new();
    "SimpleSequencer.initStream".postln();
    pat = Pbind(
      // the name of the SynthDef to use for each note
      \instrument, patchSynth.name,
      \degree, Pseq(currentState.pbind.degree),
      \octave, currentState.pbind.octave,
      // this parameter changes each beat
      //\modIndex, Prand([1.0 / 2.0, 1.0 / 4.0, 2.0, 4.0]),
      // rhythmic values
      \dur, 1,
      \amp, 1.0
      //\releaseTime, releaseTime
    );
    
    ^pat.asStream();

  }

  //handleStateChange {
    //super.handleStateChange();

    ////releaseTime.value = currentState.releaseTime;
  //}
}
