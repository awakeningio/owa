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

  var samplerPbindTest, midiFileTest;
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

  "Setting up".postln();

  MIDIClient.init;
  MIDIIn.connectAll;
  API.mountDuplexOSC();
  s.options.inDevice = "JackRouter";
  s.options.outDevice = "JackRouter";
  s.options.memSize = 8192 * 2 * 2 * 2;
  s.options.blockSize = 8;

  s.waitForBoot({
    samplerPbindTest.value();
  });

  s.boot();

}.value());
