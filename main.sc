({

  "Setting up".postln();

  API.mountDuplexOSC();

  // s.options.device = "PreSonus FIREPOD (2112)";
  s.options.device = "JackRouter";
  //s.options.sampleRate = 32000;
  //s.options.hardwareBufferSize = 2048;
  s.options.memSize = 8192 * 2;
  s.options.maxSynthDefs = 1024 * 2;

  s.waitForBoot({
    OWAController.initInstance();
  });

  s.boot();

}.value());
