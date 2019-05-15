/**
 *  @file       EminatorBassSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2019 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

EminatorBassSequencer : AwakenedSequencer {
  var control15Synthdefs,
    control16Synthdefs,
    control15DurProxy,
    control15Bus,
    control16Bus,
    control16DurProxy,
    controlPlayer,
    controlPattern,
    lastState;

  initPatch {
    control15Bus = Bus.control(Server.default, 1);
    control16Bus = Bus.control(Server.default, 1);

    control15Synthdefs = Dictionary.new();
    control16Synthdefs = Dictionary.new();

    // Creates synthdefs for playing back CC messages embedded in the midi
    // files.
    [
      'eminator_bass_L2',
      'eminator_bass_L4',
      'eminator_bass_L6'
    ].do({
      arg midiKey;

      control15Synthdefs[midiKey] = Patch({
        arg gate;

        Instr.kr("cs.utility.EnvToBus", (
          gate: gate,
          env: bufManager.midiCCEnvs[midiKey][15],
          bus: control15Bus
        ));
      }, (
        gate: KrNumberEditor(1, \gate),
      )).asSynthDef().add();

      control16Synthdefs[midiKey] = Patch({
        arg gate;

        Instr.kr("cs.utility.EnvToBus", (
          gate: gate,
          env: bufManager.midiCCEnvs[midiKey][16],
          bus: control16Bus
        ));
      }, (
        gate: KrNumberEditor(1, \gate),
      )).asSynthDef().add();
    });


    ^Patch("cs.fm.WideBass", (
      amp: -28.dbamp(),
      useSustain: 0,
      gate: KrNumberEditor(1, \gate),
      useModulatorBus: 1
    ));
  }

  assignPdefnsFromCurrentState {
    var tempo = clockController.clock.tempo,
      midiKey = currentState.midiKey;

    Pdefn('EminatorBassSeqControl16').quant = currentState.playQuant;
    Pdefn('EminatorBassSeqControl16Instr').quant = currentState.playQuant;
    Pdefn('EminatorBassSeqControl15').quant = currentState.playQuant;
    Pdefn('EminatorBassSeqControl15Instr').quant = currentState.playQuant;
    Pdefn('EminatorBassSeqNotes').quant = currentState.playQuant;


    if (midiKey.isNil() == false, {
      midiKey = midiKey.asSymbol();
      Pdefn(
        'EminatorBassSeqControl16',
        Pseq([
          [
            control16Synthdefs[midiKey].name,
            bufManager.midiCCEnvs[midiKey][16].duration * tempo
          ]
        ], inf)
      );
      Pdefn(
        'EminatorBassSeqControl15',
        Pseq([
          [
            control15Synthdefs[midiKey].name,
            bufManager.midiCCEnvs[midiKey][15].duration * tempo
          ]
        ], inf)
      );
      Pdefn(
        'EminatorBassSeqNotes',
        Pseq(bufManager.midiSequences[midiKey], inf)
      );
    });

  }

  // Sets up two different patterns, one for playing notes and another
  // for playing the CC messages converted to envelopes.
  initStream {
    this.assignPdefnsFromCurrentState();
    controlPattern = Ppar([
      Pbind(
        [\instrument, \dur], Pdefn('EminatorBassSeqControl16'),
        \legato, 0.99
      ),
      Pbind(
        [\instrument, \dur], Pdefn('EminatorBassSeqControl15'),
        \legato, 0.99
      ),
    ]);
    ^PmonoArtic(
      patch.asSynthDef().add().name,
      [\midinoteFromFile, \dur], Pdefn('EminatorBassSeqNotes'),
      \legato, 1.1,
      \midinote, Pfunc({
        arg event;
        (event['midinoteFromFile'] - 24);
      }),
      \attackModFreq, Pfunc({
        arg event;
        (event[\midinote] + 12).midicps();
      }),
      \toneModulatorLFORate, clockController.clock.tempo / 4.0,
      \toneModulatorGainMultiplierBus, control15Bus,
      \toneModulatorLFOAmountBus, control16Bus
    ).asStream();
  }

  // Overrides queue and stop methods to play the controlPattern alongside
  // the sequencer.
  queue {
    arg requeue;
    super.queue(requeue);
    controlPlayer = controlPattern.play(
      quant: currentState.playQuant,
      clock: clockController.clock
    );
  }
  stop {
    super.stop();
    controlPlayer.stop();
  }

  handleStateChange {
    lastState = currentState;
    super.handleStateChange();

    if (lastState.midiKey != currentState.midiKey, {
      this.assignPdefnsFromCurrentState();
    });
  }
}
