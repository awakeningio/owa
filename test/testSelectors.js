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
import { getLevel6Sequencers, getLevel4Sequencers } from '../src/selectors';

describe('getLevel6Sequencers', function () {
  var store,
    state,
    level6Sequencers;

  it("should select a subset of state", function () {
    store = configureStore();
    state = store.getState();
    level6Sequencers = getLevel6Sequencers(state);

    expect(state).to.have.property('sequencers');
    expect(state.sequencers).to.be.an('object');
    expect(state.sequencers).to.have.all.keys(
      '6_0',
      '6_1',
      '6_2',
      '6_3',
      '6_4',
      '6_5',
      '4_0',
      '4_1',
      '4_2',
      '4_3',
      '2_0',
      '2_1'
    );
    expect(level6Sequencers).to.be.an('array');
    expect(level6Sequencers.length).to.equal(6);
  });
});

describe('getLevel4Sequencers', function () {
  var store,
    state,
    level4Sequencers;

  it("should select a subset of state tree", function () {
    store = configureStore();
    state = store.getState();
    level4Sequencers = getLevel4Sequencers(state);

    expect(state).to.have.property('sequencers');
    expect(state.sequencers).to.be.an('object');
    expect(state.sequencers).to.have.all.keys(
      '6_0',
      '6_1',
      '6_2',
      '6_3',
      '6_4',
      '6_5',
      '4_0',
      '4_1',
      '4_2',
      '4_3',
      '2_0',
      '2_1'
    );
    expect(level4Sequencers).to.be.an('array');
    expect(level4Sequencers.length).to.equal(4);
  });
})
