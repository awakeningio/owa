AcousticKickSamplerManager {
  var <synthdef,
    <startTimesByVelocity,
    <startTimesBuf,
    bufnums;
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

      // Collects the bufnums of the alternative recordings
      bufs = fileSyms.collect({
        arg fs;
        bufManager.bufs[fs];
      });
      bufnums = bufs.collect({arg buf; buf.bufnum; });

      // Collects the start times (by velocity) as an Array of floats
      startTimesByVelocity = metadata["noteTimesInSeconds"].collect({
        arg t;
        t.asFloat();
      });

      // Converts the Array of floats into a buffer
      Buffer.loadCollection(collection: startTimesByVelocity, action: {
        arg buf;

        startTimesBuf = buf;

        // Creates synthdef, passing in all bufnums and the mapping of 
        // velocity (index) to note time in `startTimesBufnum`.
        //synthdef = Patch("owa.AcousticKickSampler", (
          //velocity: KrNumberEditor(0, [0, 127]),
          //gate: KrNumberEditor(1, \gate),
          //amp: KrNumberEditor(1.0, \amp),
          //startTimesBufnum: startTimesBuf.bufnum
        //)).asSynthDef().add();

        params['onDoneLoading'].value();
      })

    }));
  }
  sampleBufnumPattern {
    ^Pfunc({
      bufnums[rrand(0, bufnums.size - 1)];
    });
  }
}
