AcousticKickSamplerManager {
  var <synthdef,
    <startTimesByVelocity,
    <bufnums;
  *new {
    arg params;
    ^super.new.init(params);
  }
  init {
    arg params;

    var bufManager = params['bufManager'],
      metadataFilePath = params['metadataFilePath'],
      metadata = metadataFilePath.parseYAMLFile(),
      noteTimes,
      filepaths = metadata["filepaths"],
      fileSyms;

    // Creates symbol names for each file
    fileSyms = filepaths.collect({
      arg fp, i;
      fp.asSymbol();
    });

    // Loads buffers for each file
    bufManager.load_bufs(filepaths.collect({
      arg fp, i;
      [fp, fileSyms[i]];
    }), ({
      var bufs;
      "acoustic kick samples loaded".postln();
      bufs = fileSyms.collect({
        arg fs;
        bufManager.bufs[fs];
      });


      // Converts note times to floats
      startTimesByVelocity = metadata["noteTimesInSeconds"].collect({
        arg t;
        t.asFloat();
      });

      bufnums = bufs.collect({arg buf; buf.bufnum; });

      // Creates synthdef, passing in all bufnums and the mapping of 
      // velocity (index) to note time in `startTimes`.
      synthdef = Patch("owa.AcousticKickSampler", (
        bufnums: bufs.collect({arg buf; buf.bufnum; }),
        gate: KrNumberEditor(1, \gate),
        amp: KrNumberEditor(1.0, \amp),
        startTimes: noteTimes
      )).asSynthDef().add();

      params['onDoneLoading'].value();

    }));
  }
}
