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

  // TODO Move these to a test class.
  var samplerPbindTest,
    wideBassTest,
    wideBassMIDITest,
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
        (
          midiFileName: "spinny-pluck_L6_hats.mid",
          midiKey: 'spinny-pluck_L6_hats'
          makeDuration: 8
        )
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
      patch,
      synthdef,
      notes;
    
    notes = ["C#0", "D0"].notemidi();

    
    patch = Patch("cs.fm.WideBass", (
      amp: -6.dbamp(),
      useSustain: 0,
      gate: KrNumberEditor(1, \gate)
    ));
    synthdef = patch.asSynthDef().add();

    pat = PmonoArtic(
      synthdef.name,
      \note, Pseq(notes, 3),
      \octave, 2,
      \dur, 4,
      \legato, 1.2,
      \attackModFreq, Pseq(12 + notes, inf),
      \toneModulatorGainMultiplier, 1.0,
      \toneModulatorLFOAmount, 2.0,
      \toneModulatorLFORate, 1.5,
    );

    "playing...".postln();
    ~player = pat.play();
  });

  wideBassMIDITest = ({
    var pat,
      patch,
      synthdef,
      tempoBPM = 140,
      loadedSequence = 'eminator_bass_L6',
      control15Patch,
      control15Bus = Bus.control(Server.default, 1),
      control16Patch,
      control16Bus = Bus.control(Server.default, 1),
      envsPat,
      outputChannel;
    
    TempoClock.default.tempo = tempoBPM / 60.0;
    outputChannel = MixerChannel.new(
      "scratch" ,
      Server.default,
      2, 2
    );
    bufManager.load_midi([
      (
        midiFileName: "eminator_bass_L2.mid",
        midiKey: 'eminator_bass_L2',
        makeDuration: 2 * 4,
        ccsToEnv: [15, 16],
        tempoBPM: tempoBPM
      ),
      (
        midiFileName: "eminator_bass_L4_quant.mid",
        midiKey: 'eminator_bass_L4',
        makeDuration: 16 * 4,
        ccsToEnv: [15, 16],
        tempoBPM: tempoBPM
      ),
      (
        midiFileName: "eminator_bass_L6_quant.mid",
        midiKey: 'eminator_bass_L6',
        makeDuration: 4 * 7,
        ccsToEnv: [15, 16],
        tempoBPM: tempoBPM
      )
    ]);

    control15Patch = Patch({
      arg gate, env;

      Instr.kr("cs.utility.EnvToBus", (
        gate: gate,
        env: bufManager.midiCCEnvs[loadedSequence][15],
        bus: control15Bus
      ));
    }, (
        gate: KrNumberEditor(1, \gate),
    ));

    control16Patch = Patch({
      arg gate, env;

      Instr.kr("cs.utility.EnvToBus", (
        gate: gate,
        env: bufManager.midiCCEnvs[loadedSequence][16],
        bus: control16Bus
      ));
    }, (
      gate: KrNumberEditor(1, \gate),
    ));

    patch = Patch("cs.fm.WideBass", (
      amp: -6.dbamp(),
      useSustain: 0,
      gate: KrNumberEditor(1, \gate),
      useModulatorBus: 1,

    ));
    synthdef = patch.asSynthDef().add();

    bufManager.midiCCEnvs[loadedSequence][15].plot();
 
    envsPat = Ppar([
      Pbind(
        \instrument, control16Patch.asSynthDef().add().name,
        \dur, Pseq([bufManager.midiCCEnvs[loadedSequence][16].duration * TempoClock.default.tempo], inf),
        \legato, 0.99,
      ),
      Pbind(
        \instrument, control15Patch.asSynthDef().add().name,
        \dur, Pseq([bufManager.midiCCEnvs[loadedSequence][15].duration * TempoClock.default.tempo], inf),
        \legato, 0.99,
      )
    ]);
    pat = PmonoArtic(
      synthdef.name,
      [\midinoteFromFile, \dur], Pseq(bufManager.midiSequences[loadedSequence], inf),
      \legato, 1.1,
      \midinote, Pfunc({
        arg event;
        (event['midinoteFromFile'] - 24);
      }),
      \attackModFreq, Pfunc({
        arg event;
        (event[\midinote] + 12).midicps();
      }),
      //\toneModulatorGainMultiplier, 1.0,
      //\toneModulatorLFOAmount, 0.0,
      \toneModulatorLFORate, tempoBPM / 60.0 / 4,
      \toneModulatorGainMultiplierBus, control15Bus,
      \toneModulatorLFOAmountBus, control16Bus
    );
    //"playing...".postln();
    //~player = pat.play();
    envsPat.play(quant: 4);
    outputChannel.play(EventStreamPlayer.new(pat.asStream()), (quant:4));
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
  //s.dumpOSC();


  s.waitForBoot({
    TempoClock.default.tempo = 140.0 / 60.0;
    //samplerPbindTest.value();
    //wideBassTest.value();
    //multiSamplerTest.value();
    //leadPopTest.value();
    //chimeyRingSequencer.value();
    //sfxSequencerTest.value();
    wideBassMIDITest.value();
  });
  
  s.boot();

}.value());

//(
  //~player.stop();
//)

//(
  //~pat = Pseq([
    //['hello', 'world']
  //], inf);
  //~stream = ~pat.asStream();
//)

//(
  //~stream.next();
//)
