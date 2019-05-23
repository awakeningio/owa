/**
 *  @class        PitchedVoiceSampleManager
 *
 *  @classdesc    Manages loading samples and metadata for an interpolated
 *  pitched voice sampler.  Metadata is expected to contain start times
 *  for each possible velocity, as well as a mapping of MIDI note number to
 *  audio files containing all velocities for that pitch.  Each audio file
 *  is expected to use the same timing information.
 **/

PitchedVoiceSampleManager {
  var <startTimesBuf,
    renderedNotes,
    bufnumsByNote;

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
      startTimesByVelocity,
      bufsToLoad = Array.new(),
      notesByBufSym = IdentityDictionary.new(),
      filepathsByNote = metadata["filepathsByNote"];

    bufnumsByNote = IdentityDictionary.new();
    renderedNotes = SortedList.new();

    // Creates list of bufs to load
    filepathsByNote.keysValuesDo({
      arg notenumStr, filepath;
      var bufSym, notenum;

      bufSym = filepath.asSymbol();
      notenum = notenumStr.asInteger();

      notesByBufSym[bufSym] = notenum;
      bufsToLoad = bufsToLoad.add([filepath, bufSym]);
      renderedNotes.add(notenum);
    });

    "bufsToLoad:".postln;
    bufsToLoad.postln;

    bufManager.load_bufs(bufsToLoad, ({
      bufsToLoad.do({
        arg bufInfo;
        var bufSym = bufInfo[1],
          notenum = notesByBufSym[bufSym];

        bufnumsByNote[notenum] = bufManager.bufs[bufSym].bufnum;
      });

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
      });

    }));
  }
  sampleAndSampleNotePattern {
    ^Pfunc({
      arg e;
      var midinote = e['midinote'],
        upperIndex,
        lowerIndex,
        closestMidiNote;

      if (midinote == \rest, {
        [0, 0, 0]    
      }, {
        // Finds closest rendered note and returns that sample with the
        // midi note of the sample.
        upperIndex = renderedNotes.indexOfGreaterThan(midinote);
        lowerIndex = 0.max(upperIndex - 1);
        closestMidiNote = renderedNotes[lowerIndex];

        // Returns bufnum as well as midinote and fundamental freq for that
        // bufnum
        [
          bufnumsByNote[closestMidiNote],
          closestMidiNote,
          closestMidiNote.midicps()
        ];
      });
    });
  }
}
