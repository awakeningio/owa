/**
 *  @file       testSelectors.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import { expect } from 'chai';

import configureStore from "../src/configureStore";
import {
  getLevel6Sequencers,
  getLevel4Sequencer,
  getLevel2Sequencers,
  getLevel6Segments,
  getLevel4Segments,
  getLevel2Segments
} from '../src/selectors';

describe('getLevel6Segments', function () {
  var store, state;
  before(function () {
    store = configureStore();
    state = store.getState();
  });

  it('should select 6 segments', function () {
    var level6Segments = getLevel6Segments(state);

    expect(level6Segments).to.be.an('array');
    expect(level6Segments).to.have.lengthOf(6);
  });
});

describe('getLevel6Sequencers', function () {
  var store, state;
  before(function () {
    store = configureStore();
    state = store.getState();
  });

  it("should select a 6 sequencers", function () {
    var level6Sequencers;
    level6Sequencers = getLevel6Sequencers(state);

    expect(level6Sequencers).to.be.an('array');
    expect(level6Sequencers).to.have.lengthOf(6);
  });

  it('should have chosen right sequencers', function () {
    var level6Sequencers, level6Segments;
    level6Sequencers = getLevel6Sequencers(state);
    level6Segments = getLevel6Segments(state);

    level6Segments.forEach(function (segment) {
      expect(level6Sequencers.find(
          sequencer => sequencer.sequencerId === segment.sequencerId
      )).to.not.be.undefined;
    });
  });
});

describe('getLevel4Sequencer', function () {
  var store,
    state;

  before(function () {
    store = configureStore();
    state = store.getState();
  });

  it("should select a subset of state tree", function () {
    var level4Sequencer = getLevel4Sequencer(state);
    expect(level4Sequencer).to.be.an('object');
  });

  // TODO: This isn't really testing the selector, more the integrity of 
  // expected structure of our state...
  it('should be sequencer pointed at by level4 segments', function () {
    var level4Segments = getLevel4Segments(state),
      level4Sequencer = getLevel4Sequencer(state);

    level4Segments.forEach(function (segment) {
      expect(segment.sequencerId).to.equal(level4Sequencer.sequencerId);
    });
  });
});

describe('getLevel2Sequencer', function () {
  var store,
    state;

  before(function () {
    store = configureStore();
    state = store.getState();
  })

  it('should select 2 sequencers', function () {
    var level2Sequencers = getLevel2Sequencers(state);

    expect(level2Sequencers).to.be.an('array');
    expect(level2Sequencers.length).to.equal(2);
  });

  it('should be sequencers pointed at by segments', function () {
    var level2Segments = getLevel2Segments(state),
      level2Sequencers = getLevel2Sequencers(state);

    level2Segments.forEach(function (segment) {
      expect(level2Sequencers.find(
          sequencer => sequencer.sequencerId === segment.sequencerId
      )).to.not.be.undefined;
    });
  });
});
