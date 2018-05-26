~cwd = File.getcwd();
~quarkPath = File.realpath(~cwd +/+ "quarks" +/+ "owa");
{
  Quarks.install(~quarkPath); 
}.try({
  "Error installing owa quark".postln();
});
{
  Quarks.update("cs-supercollider-lib");
}.try({
  "Error updating cs-supercollider-lib".postln();
});

0.exit();
