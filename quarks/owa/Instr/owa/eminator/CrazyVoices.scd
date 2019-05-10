Instr("owa.eminator.CrazyVoices", {
	arg gate = 1,
    freq = 220,
    amp = 0.5,
    vibratoSpeed = 6,
    vibratoDepth = 4,
    vowel = 0,
    att = 0.01,
    rel = 0.1,
    filterFreq = 100,
    phasingAmt = 0.0;

	var in, vibrato, above, below, env, va, ve, vi, vo, vu, snd, sndFiltered,
    endingFilterFreq, out;

	// calculate vibrato
	// vibratoDepth is number of semitones to go up and down
	above = (freq.cpsmidi + vibratoDepth).midicps - freq;
	below = (freq.cpsmidi - vibratoDepth).midicps - freq;
	vibrato = SinOsc.kr(vibratoSpeed).range(below, above);
	// this is the basic sound source
  //in = Saw.ar(Lag.kr(freq) + vibrato);
	in = (
    -0.0.dbamp() * Saw.ar(Lag.kr(freq) + vibrato)
     + (
       Lag.kr(phasingAmt)
       * -6.0.dbamp()
       * Saw.ar(Lag.kr(1.0 * freq + 1.0/vibratoSpeed + vibrato))
     )
    //+ -3.0.dbamp() * Saw.ar(Lag.kr(2.0 * freq) + vibrato)
    //+ -3.0.dbamp() * Saw.ar(Lag.kr(3.0 * freq) + vibrato)
    //+ -3.0.dbamp() * Saw.ar(Lag.kr(4.0 * freq) + vibrato)
  );
	// amplitude envelope
	env = Env.asr(att, amp, rel).kr(doneAction: Done.freeSelf, gate: gate);

	va = BBandPass.ar(
		in: in,
		freq: [ 600, 1040, 2250, 2450, 2750 ],
		bw: [ 0.1, 0.0673, 0.0488, 0.0489, 0.0472 ],
		mul: [ 1, 0.4466, 0.3548, 0.3548, 0.1 ]);

	ve = BBandPass.ar(
		in: in,
		freq: [ 400, 1620, 2400, 2800, 3100 ] ,
		bw: [ 0.1, 0.0494, 0.0417, 0.0429, 0.0387 ],
		mul: [ 1, 0.2512, 0.3548, 0.2512, 0.1259 ]);

	vi = BBandPass.ar(
		in: in,
		freq: [ 250, 1750, 2600, 3050, 3340 ] ,
		bw: [ 0.24, 0.0514, 0.0385, 0.0393, 0.0359 ],
		mul: [ 1, 0.0316, 0.1585, 0.0794, 0.0398 ] );

	vo = BBandPass.ar(
		in: in,
		freq:[ 400, 750, 2400, 2600, 2900 ] ,
		bw: [ 0.1, 0.1067, 0.0417, 0.0462, 0.0414 ],
		mul: [ 1, 0.2818, 0.0891, 0.1, 0.01 ]);

	vu = BBandPass.ar(
		in: in,
		freq: [ 350, 600, 2400, 2675, 2950 ],
		bw: [ 0.1143, 0.1333, 0.0417, 0.0449, 0.0407 ],
		mul: [ 1, 0.1, 0.0251, 0.0398, 0.0158 ]);

	snd = SelectX.ar(Lag.kr(vowel, 0.3), [va, ve, vi, vo, vu]);
	// snd = Pan2.ar(Mix(snd), pos);
	endingFilterFreq = filterFreq / 4.0;
  //sndFiltered = SVF.ar(
    //snd,
    //XLine.kr(filterFreq, endingFilterFreq, 2.0),
    //0.7,
    //1.0,
    //0.0,
    //0.0,
    //0.0,
    //0.0
  //);
	sndFiltered = DFM1.ar(
    //CrossoverDistortion.ar(snd, 0.05, 0.1),
    snd,
    //snd,
		//XLine.kr(filterFreq, endingFilterFreq, 2.0),
    filterFreq,
		0.73,
		0.9,
		0.0,
		0.0009
	);

  out = (0.75 * sndFiltered + 0.25 * snd) * env;
  
  out = CompanderD.ar(
    out,
    thresh: -12.0.dbamp(),
    slopeBelow: 0.6,
    slopeAbove: 0.4,
    clampTime: 0.005,
    relaxTime: 0.3,
    mul: 2.0.dbamp()
  );
  
}, [
  \gate,
  \freq,
  \amp,
  \beats,
  \lofreq,
  [0, 12],
  [0, 4],
  [0.01, 10.0],
  [0.01, 10.0],
  \widefreq,
  \unipolar
]);
