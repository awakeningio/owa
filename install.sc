~cwd = File.getcwd();
~quarkPath = File.realpath(~cwd +/+ "quarks" +/+ "owa");
Quarks.checkForUpdates({
  {
    Quarks.install(~quarkPath); 
  }.try({
    "Error installing owa quark".postln();
  });

  0.exit();
});
