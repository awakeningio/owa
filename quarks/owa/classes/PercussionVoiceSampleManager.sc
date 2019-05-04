/**
 *  @class        PercussionVoiceSampleManager
 *
 *  @classdesc    Manages loading samples and metadata for a single percussion
 *  voice.  Metadata is expected to contain start times for each possible
 *  velocity and samples are expected to be randomized for each note.
 **/
PercussionVoiceSampleManager {
  var <startTimesBuf,
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
      fileSyms,
      startTimesByVelocity,
      bufsToLoad;

    // Creates symbol names for each file
    fileSyms = filepaths.collect({
      arg fp, i;
      fp.asSymbol();
    });

    bufsToLoad = filepaths.collect({
      arg fp, i;
      [fp, fileSyms[i]];
    });

    // Loads buffers for each file
    bufManager.load_bufs(bufsToLoad, ({
      var bufs;

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
