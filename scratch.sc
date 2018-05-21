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

  var samplerPbindTest, wideBassTest, multiSamplerTest;
  var bufManager = BufferManager.new((
    rootDir: "SOUNDS_DIRECTORY_PATH".getenv()
  ));

  multiSamplerTest = ({
    var midiFileSequences,
      patch,
      patchSynth,
      pat,
      bufs;

    bufManager.load_bufs([
      ["hhclosed_96 [2018-05-20 155504].wav", \hhclosed_96],
      ["hhopen_83 [2018-05-20 155504].wav", \hhopen_83]
    ], ({
      bufManager.load_midi([
        ["spinny-pluck_L6_hats.mid", 'spinny-pluck_L6_hats', 8]
      ]);

      midiFileSequences = bufManager.midiSequences['spinny-pluck_L6_hats'];

      bufs = (
        22: bufManager.bufs[\hhclosed_96].bufnum,
        25: bufManager.bufs[\hhopen_83].bufnum,
        rest: 0
      );
      patch = Patch("owa.HiHatSampler", (
      ));
      patch.prepareForPlay();
      patchSynth = patch.asSynthDef().add();
      
      pat = Pbind(
        \instrument, patchSynth.name,
        [\midinote, \dur], Pseq(midiFileSequences, inf),
        \bufnum, Pfunc({
          arg event;
         
          bufs[event[\midinote]];
        })
      );
      ~player = pat.play();
      
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
    multiSamplerTest.value();
  });

  s.boot();

}.value());

(
  ~player.stop();
)
