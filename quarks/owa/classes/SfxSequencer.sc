/**
 *  @file       SfxSequencer.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

SfxSequencer : AwakenedSequencer {
  initStream {
    // TODO: break this out into multiple streams, currently it's all together
    // in a single loop
    ^Pbind(
      \type, \instr,
      \instr, "cs.sfx.PlayBuf",
      \buf, bufManager.bufs['spinny-pluck_L6_sfx'],
      \attackTime, 0.0,
      \releaseTime, 0.0,
      \midinote, Pseq(["C3".notemidi()], inf),
      \dur, Pseq([8*4], inf)
    ).asStream();
  }
}
