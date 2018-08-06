/**
 *  @file       ChordProgSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

ChordProgSequencer : AwakenedSequencer {
  var synthdefsForBufNames,
    bufNameProxy;

  initPatch {
    synthdefsForBufNames = ();
    currentState.bufNames.do({
      arg bufName;
      var bufSym = bufName.asSymbol();

      patch = Patch("cs.sfx.PlayBuf", (
        buf: bufManager.bufs[bufSym],
        gate: KrNumberEditor(1, \gate),
        attackTime: 0.0,
        releaseTime: 0.0,
        isSustained: 1
      ));
      synthdefsForBufNames[bufSym] = patch.asSynthDef().add();
    });

    bufNameProxy = PatternProxy.new;
    bufNameProxy.quant = currentState.playQuant;

  }
  initStream {

    bufNameProxy.source = Pseq(currentState.bufSequence, inf);

    ^Pbind(
      \bufName, bufNameProxy,
      \instrument, Pfunc({
        arg event;

        synthdefsForBufNames[event[\bufName].asSymbol()].name;
      }),
      \midinote, "C3".notemidi(),
      \dur, Pseq([currentState.numBeats], inf),
      \legato, 2.0,
      \amp, 6.0.dbamp(),
      \sendGate, true
    ).asStream();
  }

  handleStateChange {
    super.handleStateChange();
    bufNameProxy.source = Pseq(currentState.bufSequence, inf);
  }
}
