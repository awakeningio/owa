/**
 *  @class        SlicedVoiceSampleManager
 *
 *  @classdesc    Manages loading samples and metadata for a single voice that
 *  is sliced, no velocity or pitch.  Expects one file.
 **/
SlicedVoiceSampleManager {
  var <startTimesBuf,
    <sample,
    <numSlices;
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
      filepath = metadata["filepaths"].at(0),
      fileSym,
      startTimesBySliceIndex;

    // Creates symbol names for each file
    fileSym = filepath.asSymbol();

    // Loads buffer
    bufManager.load_bufs([[filepath, fileSym]], ({
      sample = bufManager.bufs[fileSym];

      // Collects the start times as an Array of floats
      startTimesBySliceIndex = metadata["noteTimesInSeconds"].collect({
        arg t;
        t.asFloat();
      });

      numSlices = metadata["noteTimesInSeconds"].size();

      // Converts the Array of floats into a buffer
      Buffer.loadCollection(collection: startTimesBySliceIndex, action: {
        arg buf;

        startTimesBuf = buf;

        params['onDoneLoading'].value();
      });

    }));
    
  }
}
