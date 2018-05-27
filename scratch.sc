/**
 *  @file       scratch.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

({

  var samplerPbindTest,
    wideBassTest,
    multiSamplerTest,
    leadPopTest,
    chimeyRingSequencer,
    sfxSequencerTest,
    bufManager = BufferManager.new((
    rootDir: "SOUNDS_DIRECTORY_PATH".getenv()
  ));

  sfxSequencerTest = ({
    bufManager.load_bufs([
      ["spinny-pluck_L6_sfx [2018-05-27 133232].wav", 'spinny-pluck_L6_sfx']
    ], ({
      ~player = Pbind(
        \type, \instr,
        \instr, "cs.sfx.PlayBuf",
        \buf, bufManager.bufs['spinny-pluck_L6_sfx'],
        \attackTime, 0.0,
        \releaseTime, 0.0,
        \midinote, Pseq(["C3".notemidi()], inf),
        \dur, 8*4
      ).play();
    }));
  });

  chimeyRingSequencer = ({
    bufManager.load_bufs([
      ["chime high pitch ring_D.wav", \chime_ring_d]
    ], ({
      //bufManager.load_midi([
        //["spinny-pluck_L6_hats.mid", 'spinny-pluck_L6_hats', 8]
      //]);

      //midiFileSequences = bufManager.midiSequences['spinny-pluck_L6_hats'];

      //"midiFileSequences:".postln;
      //midiFileSequences.postln;

      var originalFreq = "C4".notemidi().midicps();

      ~player = Ppar([
        Pbind(
          \type, \instr,
          \instr, "owa.PitchedSampler",
          \originalFreq, originalFreq,
          \scale, Scale.minor,
          \root, 2,
          \octave, 5,
          \degree, Pseq([
            \rest,  0,   \rest
          ], inf),
          \dur, Pseq([
            7,      0.5,  0.5
          ], inf),
          \reversed, Pseq([
            0
          ], inf),
          \bufnum, bufManager.bufs[\chime_ring_d].bufnum,
          \amp, -20.dbamp(),
          \releaseTime, 5.0,
          \attackTime, 0.3
        ),
        Pbind(
          \type, \instr,
          \instr, "owa.PitchedSampler",
          \originalFreq, originalFreq,
          \scale, Scale.minor,
          \root, 2,
          \octave, 4,
          \degree, Pseq([
            \rest,  4,  \rest,
          ], inf),
          \dur, Pseq([
            1,      6,  1
          ], inf),
          \reversed, Pseq([
            1
          ], inf),
          \bufnum, bufManager.bufs[\chime_ring_d].bufnum,
          \amp, -20.dbamp(),
          \releaseTime, 5.0,
          \attackTime, 0.3,
          \startTime, 3.5
        )
      ]).play();
      
    }));
  });

  leadPopTest = ({
    var pat;
    pat = Pbind(
      \type, \instr,
      \instr, "cs.percussion.Impulsive",
      \note, Pseq(["c3".notemidi(), \rest, "c3".notemidi()], inf),
      \dur, Pseq([1], inf)
    );
    ~player = pat.play();
  });

  multiSamplerTest = ({
    var midiFileSequences,
      patch,
      patchSynth,
      pat,
      bufs,
      outputChannel;

    outputChannel = MixerChannel.new(
      "scratch" ,
      Server.default,
      2, 2
    );

    bufManager.load_bufs([
      ["kick_01 [2018-05-20 115711].wav", \kick_01],
      ["hhclosed_96 [2018-05-20 155504].wav", \hhclosed_96],
      ["hhopen_83 [2018-05-20 155504].wav", \hhopen_83]
    ], ({
      bufManager.load_midi([
        ["spinny-pluck_L6_hats.mid", 'spinny-pluck_L6_hats', 8]
      ]);

      midiFileSequences = bufManager.midiSequences['spinny-pluck_L6_hats'];

      //"midiFileSequences:".postln;
      //midiFileSequences.postln;

      bufs = (
        22: bufManager.bufs[\hhclosed_96].bufnum,
        25: bufManager.bufs[\hhopen_83].bufnum,
        rest: 0
      );
      
      pat = Pbind(
        //\instrument, patchSynth.name,
        \type, \instr,
        \instr, "owa.HiHatSampler",
        [\midinote, \dur], Pseq(midiFileSequences, inf),
        \legato, Pfunc({
          arg event;
          if (event[\midinote] === 25, {
            0.75;
          }, {
            1.0;
          });
        }),
        \bufnum, Pfunc({
          arg event;
         
          bufs[event[\midinote]];
        }),
      );
      //~player = pat.play();
      outputChannel.play(EventStreamPlayer.new(pat.asStream()));
      
    }));
  });

  samplerPbindTest = ({
    
    
    bufManager.load_bufs([
      ["kick_01 [2018-05-20 115711].wav", \kick_01]
    ], ({
      var midiFileSequences;
      var pat,
        patch,
        patStream,
        patchSynth,
        note;


      //bufManager.load_midi([
        //["subtle_kick.mid", \subtle_kick, 8]
      //]);

      //midiFileSequences = bufManager.midiSequences[\subtle_kick];

      patch = Patch("cs.sfx.PlayBuf", (
        buf: bufManager.bufs[\kick_01],
        convertToStereo: 1,
        attackTime: 0.0,
        releaseTime: 0.0,
        gate: 0
      ));
      patch.prepareForPlay();
      patchSynth = patch.asSynthDef().add();

      note = "C1".notemidi();

      pat = Pbind(
        \instrument, patchSynth.name,
        \gate, 1,
        \midinote, Pseq([note, \rest, note], inf),
        \dur, Pseq([1], inf)
      );

      ~player = pat.play();

    }));
  });

  wideBassTest = ({
    var pat,
      notes;
    
    notes = ["C#0", "D0"].notemidi();

    pat = Pbind(
      \amp, 0.7,
      \type, \instr,
      \instr, "cs.fm.WideBass",
      \note, Pseq(notes, inf),
      \octave, 2,
      \dur, 4,
      \sustain, 3.5,
      \attackModFreq, Pseq(12 + notes, inf),
      \toneModulatorGainMultiplier, 1.0,
      \toneModulatorLFOAmount, 2.0,
      \toneModulatorLFORate, 1.5,
      \sendGate, true
    );

    "playing...".postln();
    ~player = pat.play();
  });

  "Setting up".postln();

  MIDIClient.init;
  MIDIIn.connectAll;
  API.mountDuplexOSC();
  s.options.inDevice = "JackRouter";
  s.options.outDevice = "JackRouter";
  s.options.memSize = 8192 * 2 * 2 * 2;
  s.options.blockSize = 8;
  s.meter();
  s.plotTree();

  TempoClock.default.tempo = 140.0 / 60.0;

  s.waitForBoot({
    //samplerPbindTest.value();
    //wideBassTest.value();
    //multiSamplerTest.value();
    //leadPopTest.value();
    //chimeyRingSequencer.value();
    sfxSequencerTest.value();
  });

  s.boot();

}.value());

(
  ~player.stop();
)
