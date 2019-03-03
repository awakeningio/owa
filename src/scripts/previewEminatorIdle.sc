(
  ~idlePatch = Patch({
    arg gate;
    var out;
    
    out = Instr.ar("owa.EminatorIdle", (
      gate: gate,
      releaseTime: 5.0
    ));

    // stereo for previewing
    [out, out];
  }, (
    gate: KrNumberEditor(1, \gate)
  ));
  ~idlePatch.play();
)

(
  ~idlePatch.set(\gate, 0);
)
