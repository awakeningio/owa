/**
 *  @file       SpinnyKalimbaSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

SpinnyKalimbaSequencer : SCReduxSequencer {
  var synthdef;

  initPatch {

		synthdef = SynthDef(\kalimba, {
			|out = 0, freq = 440, amp = 0.1, mix = 0.1|
			var snd;
			// Basic tone is a SinOsc
			snd = SinOsc.ar(freq) * EnvGen.ar(Env.perc(0.005, Rand(2.5, 3.5), 1, -8), doneAction: 2);
			// The "clicking" sounds are modeled with a bank of resonators excited by enveloped pink noise
			snd = (snd * (1 - mix)) + (DynKlank.ar(`[
				// the resonant frequencies are randomized a little to add variation
				// there are two high resonant freqs and one quiet "bass" freq to give it some depth
				[240*ExpRand(0.9, 1.1), 2020*ExpRand(0.9, 1.1), 3151*ExpRand(0.9, 1.1)],
				[-7, 0, 3].dbamp,
				[0.8, 0.05, 0.07]
			], PinkNoise.ar * EnvGen.ar(Env.perc(0.001, 0.01))) * mix);
			Out.ar(out, Pan2.ar(snd, 0, amp));
		}).add;
    
  }
  initStream {
    ^Pbind(
      \instrument, synthdef.name,
      \degree, Prand([
        Pseq([\rest, 8, 2, 3, 7]),
        Pseq([\rest, 8, 5, 7, 0]),
        Pseq([\rest, 7, 7, 7, 7])
      ], inf),
      \dur, Prand([
        Pseq([0.5, 4, 4, 4, 3.5]),
        Pseq([0.5, 2, 2, 2, 2.5])
      ], inf),
      \scale, Scale.major,
      \root, 1,
      \octave, Prand([
        Pseq([5, 5, 5, 5, 5]),
        Pseq([6, 6, 6, 6, 6]),
      ], inf),
      \legato, Prand([0.3, 0.15], inf),
      \amp, -21.0.dbamp(),
      \mix, Pwhite(0.05, 0.35),
    ).asStream();
  }
}
