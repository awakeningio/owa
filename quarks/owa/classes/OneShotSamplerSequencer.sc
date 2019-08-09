/**
 *  @file       OneShotSamplerSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

OneShotSamplerSequencer : AwakenedSequencer {
  var synthdefsForBufNames,
    lastAmp = false,
    lastAttackTime = false,
    lastReleaseTime = false,
    state = false,
    lastState = false,
    ampProxy,
    attackTimeProxy,
    releaseTimeProxy;

  initPatch {
    synthdefsForBufNames = ();

    // create a synthdef for each possible buf
    currentState.bufNames.do({
      arg bufName;
      var bufSym = bufName.asSymbol();
      var patch = Patch("cs.sfx.StreamBuf", (
        buf: bufManager.bufs[bufSym],
        gate: KrNumberEditor(1, \gate),
        attackTime: KrNumberEditor(0.0, [0.0, 200.0]),
        releaseTime: KrNumberEditor(0.0, [0.0, 20.0]),
        amp: KrNumberEditor(1.0, \amp),
        isSustained: 1,
        convertToStereo: 1
      ));

      patch.gate.lag = 0;

      synthdefsForBufNames[bufSym] = patch.asSynthDef().add();
    });

    ampProxy = PatternProxy.new;
    attackTimeProxy = PatternProxy.new;
    releaseTimeProxy = PatternProxy.new;

    ampProxy.quant = currentState.playQuant;
    attackTimeProxy.quant = currentState.playQuant;
    releaseTimeProxy.quant = currentState.playQuant;
    ampProxy.source = currentState.amp;
    attackTimeProxy.source = currentState.attackTime;
    releaseTimeProxy.source = currentState.releaseTime;
  }

  initStream {
    // when the stream is created, use the current `bufName` to select
    // the proper synthdef.

    ^Pbind(
      \attackTime, attackTimeProxy,
      \releaseTime, releaseTimeProxy,
      \amp, ampProxy,
      \instrument, synthdefsForBufNames[currentState.bufName.asSymbol()].name,
      \midinote, Pseq(["C3".notemidi()]),
      \dur, Pseq([currentState.numBeats]),
      \legato, 1.0
    ).asStream();
  }

  handleStateChange {
    super.handleStateChange();
    lastState = state;
    state = store.getState();

    if (lastAmp != currentState.amp, {
      lastAmp = currentState.amp;
      ampProxy.quant = currentState.playQuant;
      ampProxy.source = currentState.amp;
    });

    if (lastReleaseTime != currentState.releaseTime, {
      lastReleaseTime = currentState.releaseTime;
      releaseTimeProxy.quant = currentState.playQuant;
      releaseTimeProxy.source = currentState.releaseTime;
    });

    if (lastAttackTime != currentState.attackTime, {
      lastAttackTime = currentState.attackTime;
      attackTimeProxy.quant = currentState.playQuant;
      attackTimeProxy.source = currentState.attackTime;
    });

    if (lastState != false, {
      if ((
        lastState.sessionPhase != state.sessionPhase
      ).and(state.sessionPhase == "IDLE"), {
        // When switching back to idle mode, re-cue all bufs
        currentState.bufNames.do({
          arg bufName;
          var bufKey = bufName.asSymbol();
          bufManager.recue_buf(bufKey);
        });
      });
    });
  }

}
