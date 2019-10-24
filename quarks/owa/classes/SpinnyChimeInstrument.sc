SpinnyChimeInstrument {
  var bufManager, <patch, <pattern, clock;
  *new {
    arg params;
    ^super.new().init(params);
  }
  *getBufsToLoadList {
    ^[
      ["chime high pitch ring_D.wav", \chime_ring_d]
    ]
  }
  init {
    arg params;
    var synthdef;

    bufManager = params['bufManager'];
    clock = params['clock'];

    
  }
}
