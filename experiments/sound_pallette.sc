/**
 *  @file       sound_pallette.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *  @author     Emma Lefley
 *
 *  @copyright  2018 Colin Sullivan & Emma Lefley
 *  @license    Licensed under the GPLv3 license.
 **/

(
  s.plotTree;
)
(
  s.quit;
  s.options.inDevice = "JackRouter";
  s.options.outDevice = "JackRouter";
  s.options.memSize = 8192 * 2 * 2 * 2;
  s.options.blockSize = 8;
  s.boot();
  MIDIClient.init();
  MIDIIn.connectAll;
)

(

  // eerie

  {
    a = PinkNoise.ar(1!2);

    // TODO: explore count
    50.do{

      a = BBandStop.ar(
        a,
        LFNoise1.kr(MouseX.kr(0.2, 2.0)).exprange(40, 15000),
        exprand(0.1, 2)
      );

    };

    LPF.ar(a, 1e5)
    //LPF.ar(a, MouseY.kr(100, 10000))

  }.play

)

(
  //chimy ring


  play{

    b = LocalBuf(4e5, 2).clear;

    BufCombL.ar(
      b,
      LeakDC.ar(
        LPF.ar(

          PlayBuf.ar(2, b, 16/15, 0, 0, 1), 300)

        )
        +
        Blip.ar([20, 21], 1),
        2,
        40
      ) / 20
  }
)

(
  // light bells
  // TODO: turn into a midi voicer


  play{

    //x = Splay.ar({

      //|i|
      //i = 1;
      var freq = 440,
        amp,
        env = Env.perc();

      amp = EnvGen.ar(env, doneAction: 2);


      RLPF.ar(
        //0.6 ** i * 40 * Impulse.ar(MouseX.kr(0, 100) + 2**i/32, 1/2),
        Impulse.ar(0),

        //4**LFNoise0.kr(1/16)*300,
        freq,

        5e-3
      ).sin

    //}!2);

    //2.do{
      //x = FreeVerb2.ar(*x++[0.1,1,1])
    //};

    //x
  }
)

(

  Instr.at("cs.fm.BasicFM").miditest([3, \omni]);
)

(
  Instr("cs.fm.BasicFM").spawnEvent((
    freq: 440,
    modulatorFreqRatio: 0.5,
    gate: 1,
    modEnvShape: Env.perc(0.0, 0.2, curve: 50),
    carrierEnvShape: Env.perc(0.01, 0.2),
    modOsc: "cs.osc.sin"
  ));
)

(
  var v,
    socket;
  v = Voicer(8, Instr("cs.fm.BasicFM"), [
    modulatorFreqRatio: 2.0,
    \modEnvShape,  Env.perc(0.0, 0.2)
  ]);
  socket = VoicerMIDISocket.new([3, \omni], v);
)
