/**
 *  @file       EminatorBassSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2019 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

EminatorBassSequencer : SCReduxSequencer {
  var control15Synthdefs,
    control16Synthdefs,
    control15Bus,
    control16Bus,
    controlPlayer,
    controlPattern,
    lastState,
    legatoForMidiKey;

  initPatch {
    var patch;
    control15Bus = Bus.control(Server.default, 1);
    control16Bus = Bus.control(Server.default, 1);

    control15Synthdefs = Dictionary.new();
    control16Synthdefs = Dictionary.new();

    legatoForMidiKey = (
      'eminator_bass_L2': 1.1,
      'eminator_bass_L4': 1.1,
      'eminator_bass_L6': 1.1,
      'eminator_bass_L6_01': 1.1,
      'eminator_bass_L6_02': 0.99,
      'eminator_bass_L6_03': 0.99
    );

    // Creates synthdefs for playing back CC messages embedded in the midi
    // files.
    [
      'eminator_bass_L2',
      'eminator_bass_L4',
      'eminator_bass_L6',
      'eminator_bass_L6_01',
      'eminator_bass_L6_02',
      'eminator_bass_L6_03'
    ].do({
      arg midiKey;
      var control15Patch, control16Patch;

      control15Patch = Patch({
        arg gate;

        Instr.kr("cs.utility.EnvToBus", (
          gate: gate,
          env: bufManager.midiCCEnvs[midiKey][15],
          bus: control15Bus
        ));
      }, (
        gate: KrNumberEditor(1, \gate),
      ));
      control15Patch.gate.lag = 0;
      control15Synthdefs[midiKey] = control15Patch.asSynthDef().add();

      control16Patch = Patch({
        arg gate;

        Instr.kr("cs.utility.EnvToBus", (
          gate: gate,
          env: bufManager.midiCCEnvs[midiKey][16],
          bus: control16Bus
        ));
      }, (
        gate: KrNumberEditor(1, \gate),
      ));
      control16Patch.gate.lag = 0;
      control16Synthdefs[midiKey] = control16Patch.asSynthDef().add();
    });


    patch = Patch("owa.eminator.Bass", (
      useSustain: 0,
      gate: KrNumberEditor(1, \gate),
      useModulatorBus: 1
    ));
    patch.gate.lag = 0;
    ^patch;
  }

  assignPdefnsFromCurrentState {
    var tempo = clock.tempo,
      midiKey = currentState.midiKey;

    Pdefn('EminatorBassSeqControl16').quant = currentState.propQuant;
    Pdefn('EminatorBassSeqControl16Instr').quant = currentState.propQuant;
    Pdefn('EminatorBassSeqControl15').quant = currentState.propQuant;
    Pdefn('EminatorBassSeqControl15Instr').quant = currentState.propQuant;
    Pdefn('EminatorBassSeqNotes').quant = currentState.propQuant;
    Pdefn('EminatorBassSeqLegato').quant = currentState.propQuant;


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
      Pdefn(
        'EminatorBassSeqLegato',
        Pseq([legatoForMidiKey[midiKey]], inf)
      );
    });

  }

  // Sets up two different patterns, one for playing notes and another
  // for playing the CC messages converted to envelopes.
  initStream {
    this.assignPdefnsFromCurrentState();
    ^Ppar([
      Pbind(
        [\instrument, \dur], Pdefn('EminatorBassSeqControl16'),
        \legato, 0.99
      ),
      Pbind(
        [\instrument, \dur], Pdefn('EminatorBassSeqControl15'),
        \legato, 0.99
      ),
      PmonoArtic(
        patch.asSynthDef().add().name,
        [\midinoteFromFile, \dur], Pdefn('EminatorBassSeqNotes'),
        \legato, Pdefn('EminatorBassSeqLegato'),
        \midinote, Pfunc({
          arg event;
          (event['midinoteFromFile'] - 24);
        }),
        \attackModFreq, Pfunc({
          arg event;
          (event[\midinote] + 12).midicps();
        }),
        \toneModulatorLFORate, clock.tempo / 4.0,
        \toneModulatorGainMultiplierBus, control15Bus,
        \toneModulatorLFOAmountBus, control16Bus
      )
    ]).asStream();
  }

  handleStateChange {
    lastState = currentState;
    super.handleStateChange();

    if (lastState.midiKey != currentState.midiKey, {
      this.assignPdefnsFromCurrentState();
    });
    
  }
}
