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
    OWACompositionEnvironment.start(());
  });

  s.meter();
  s.boot();


}).value();
