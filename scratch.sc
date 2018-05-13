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

  var samplerPbindTest, wideBassTest;
  var bufManager = BufferManager.new((
    rootDir: "SOUNDS_DIRECTORY_PATH".getenv()
  ));

  samplerPbindTest = ({
    
    
    bufManager.load_bufs([
      ["subtle_kick_01 [2018-04-13 134203].wav", \subtle_kick_01]
    ], ({
      var midiFileSequences;
      var pat,
        patch,
        patStream,
        patchSynth;


      bufManager.load_midi([
        ["subtle_kick.mid", \subtle_kick, 8]
      ]);

      midiFileSequences = bufManager.midiSequences[\subtle_kick];

      patch = Patch("cs.sfx.PlayBuf", (
        buf: bufManager.bufs[\subtle_kick_01],
        convertToStereo: 1,
        attackTime: 0.0,
        releaseTime: 0.0,
        gate: 0
      ));
      patch.prepareForPlay();
      patchSynth = patch.asSynthDef().add();

      pat = Pbind(
        \instrument, patchSynth.name,
        \gate, 1,
        [\midinote, \dur], Pseq(midiFileSequences, inf)
      );

      pat.play();

    }));
  });

  wideBassTest = ({
    var pat,
      patch,
      patchSynth,
      notes;
    patch = Patch("cs.fm.WideBass", (
      amp: 0.7,
      //attackModFreq: "A4".notemidi().midicps(),
      //toneModulatorGainMultiplier: 7.0,
      //toneModulatorLFOAmount: 40.0,
      //toneModulatorLFORate: 0.75
    ));
    patch.prepareForPlay();
    patchSynth = patch.asSynthDef().add();
    
    notes = ["C#0", "D0"].notemidi();
    "notes:".postln;
    notes.postln;

    pat = Pbind(
      \amp, 0.7,
      \type, \instr,
      \instr, "cs.fm.WideBass",
      \note, Pseq(notes, inf),
      \dur, 4,
      \sustain, 3.5,
      \attackModFreq, "A0".notemidi().midicps(),
      \toneModulatorGainMultiplier, 2.0,
      \toneModulatorLFOAmount, 4.0,
      \toneModulatorLFORate, 1.5
    );

    "playing...".postln();
    pat.play();
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
    wideBassTest.value();
  });

  s.boot();

}.value());
