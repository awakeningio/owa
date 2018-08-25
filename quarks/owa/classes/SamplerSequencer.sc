/**
 *  @file       SamplerSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

SamplerSequencer : AwakenedSequencer {
  var synthdefsForBufNames,
    lastAmp = false,
    ampProxy;

  initPatch {
    synthdefsForBufNames = ();

    // create a synthdef for each possible buf
    currentState.bufNames.do({
      arg bufName;
      var bufSym = bufName.asSymbol();

      synthdefsForBufNames[bufSym] = Patch("cs.sfx.PlayBuf", (
        buf: bufManager.bufs[bufSym],
        gate: KrNumberEditor(1, \gate),
        attackTime: KrNumberEditor(0.0, [0.0, 200.0]),
        releaseTime: KrNumberEditor(0.0, [0.0, 20.0]),
        amp: KrNumberEditor(1.0, \amp),
        isSustained: 1
      )).asSynthDef().add();
    });

    ampProxy = PatternProxy.new;

    ampProxy.quant = currentState.playQuant;
    ampProxy.source = currentState.amp;
  }

  initStream {

    // when the stream is created, use the current `bufName` to select
    // the proper synthdef.

    ^Pbind(
      \attackTime, currentState.attackTime,
      \releaseTime, currentState.releaseTime,
      \amp, ampProxy,
      \instrument, synthdefsForBufNames[currentState.bufName.asSymbol()].name,
      \midinote, Pseq(["C3".notemidi()]),
      \dur, Pseq([currentState.numBeats]),
      \legato, 1.0,
      \sendGate, true
    ).asStream();
  }

  handleStateChange {
    super.handleStateChange();

    if (lastAmp != currentState.amp, {
      lastAmp = currentState.amp;
      ampProxy.quant = currentState.playQuant;
      ampProxy.source = currentState.amp;
    });
  }

}
