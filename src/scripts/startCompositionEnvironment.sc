({
  MIDIClient.init;
  MIDIIn.connectAll;
  API.mountDuplexOSC();
  s.options.device = "JackRouter";
  s.options.numOutputBusChannels = 48;
  s.options.numInputBusChannels = 48;
  s.options.memSize = 8192 * 2 * 2 * 2;
  s.options.blockSize = 8;

  s.waitForBoot({
    s.meter();
    s.plotTree();
    OWACompositionEnvironment.start(());
  });

  s.boot();


}).value();
