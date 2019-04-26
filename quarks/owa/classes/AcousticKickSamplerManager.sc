AcousticKickSamplerManager {
  var synthdefs,
    <bufs,
    noteTimesByVelocity;
  *new {
    arg params;
    ^super.new.init(params);
  }
  init {
    arg params;

    var bufManager = params['bufManager'],
      metadataFilePath = params['metadataFilePath'],
      metadata = metadataFilePath.parseYAMLFile(),
      noteVelocities,
      noteTimes,
      filepaths = metadata["filepaths"],
      fileSyms;

    noteTimesByVelocity = Dictionary.new();
    synthdefs = Array.new();

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
      "acoustic kick samples loaded".postln();
      bufs = fileSyms.collect({
        arg fs;
        bufManager.bufs[fs];
      });


      // Creates a map from note velocity to time in the files
      noteVelocities = metadata["noteVelocities"];
      noteTimes = metadata["noteTimesInSeconds"];

      noteVelocities.do({
        arg vel, i;
        noteTimesByVelocity[vel.asSymbol()] = noteTimes[i];
      });

      // Creates a synthdef for each alternative file
      bufs.do({
        arg buf;
        synthdefs.add(Patch("owa.AcousticKickSampler", (
          bufnum: buf.bufnum,
          gate: KrNumberEditor(1, \gate),
          amp: KrNumberEditor(1.0, \amp)
        )).asSynthDef().add());
      });

      params['onDoneLoading'].value();

    }));
  }
  getPatternParams {
    ^Pfunc({
      arg e;
      [
        this.getRandomSynthDef().name,
        this.getStartTimeForVelocity(e['velocity']),
        false
      ]
    });
  }
  getRandomSynthDef {
    ^synthdefs[rrand(0, synthdefs.size - 1)];
  }
  getStartTimeForVelocity {
    arg vel;
    ^noteTimesByVelocity[vel.asSymbol()].asFloat();
  }
}
