({
  MIDIClient.init;
  MIDIIn.connectAll;
  API.mountDuplexOSC();

  s.options.device = "JackRouter";
  s.options.numOutputBusChannels = 48;
  s.options.numInputBusChannels = 48;

  //// Trying new audio routing system, all channel mappings need to be lessened
  //// by 14 when doing this, because the hardware outputs are no longer present
  //// before the virtual inputs
  //s.options.device = "BlackHole 34ch";
  //s.options.hardwareBufferSize = 256;
  //s.options.numOutputBusChannels = 34;
  //s.options.numInputBusChannels = 34;

  s.options.memSize = 8192 * 2 * 2 * 2;
  s.options.blockSize = 8;

  s.waitForBoot({
    s.meter();
    s.plotTree();
    OWACompositionEnvironment.start(());
  });

  s.boot();


}).value();
