OWACompositionEnvironment {
  classvar <>instance;
  *new {
    ^super.new().init();
  }
  *start {
    arg params;
    if (this.instance != nil, {
      "OWACompositionEnvironment already started".throw();    
    }, {
      this.instance = OWACompositionEnvironment.new(params);
    });
    ^this.instance;
  }
  init {
    arg params;

    var clock,
      owaKickEnvironment,
      owaBassEnvironment;

    Server.default.latency = 0.1;
    clock = LinkClock();

    owaKickEnvironment = OWAKickEnvironment.new((
      inChannel: 6,
      outputBus: 24
    ));
    owaBassEnvironment = OWABassVoicerEnvironment.new((
      inChannel: 5,
      outputBus: 28
    ));

    ^this;  
  }
}
