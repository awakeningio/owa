(
  var instr;
  var patch;

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
  //instr = Instr("cs.percussion.Impulsive") 
  // define a simple synth
  ~patch = Patch("cs.percussion.Impulsive");
  //~patch.releaseTime.value = 0.4;
  ~patch.prepareForPlay();
  ~patchSynth = ~patch.asSynthDef().add();
)

~stop_player = {
	var player = ~player;
  if (player != nil, {
    TempoClock.default.play({
      player.stop();
    }, [4, 0]);
  });
};


(
  ~scale = Scale.at(\whole);
)

(
  ~stop_player.value();
)

(
  var dur = [1, 1, 1, 1, 1];
  ~stop_player.value();
  ~pat = Pbind(
    // the name of the SynthDef to use for each note
    \instrument, ~patchSynth.name,
    //\degree, Pseq([16, 12, 12, 12, 12], inf),
    \degree, Pseq([24, Pseries(8, 4, 4), Pseries(16, -4, 4), 4], inf),
    \scale, ~scale,
    // rhythmic values
    //\dur, Pseq(dur, inf),
    \dur, Pbrown(1.0/16.0, 1.0, 1.0/16.0),
    //\releaseTime, ~patch.releaseTime
  );
  
  ~player = ~pat.play(TempoClock.default, (), [4, 0]);
)

(
  ~player.stop();
)


(
  "Setting up".postln();

  API.mountDuplexOSC();

  // s.options.device = "PreSonus FIREPOD (2112)";
  s.options.device = "JackRouter";
  //s.options.sampleRate = 32000;
  //s.options.hardwareBufferSize = 2048;
  s.options.memSize = 8192 * 2;
  s.options.maxSynthDefs = 1024 * 2;

  s.boot();

)

(
  TempoClock.default.tempo = 1.8;
)

(
  Scale.directory
)
