/**
 *  @file       segments.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

import awakeningSequencers from 'awakening-sequencers';
const PLAYING_STATES = awakeningSequencers.PLAYING_STATES;

export function create_default_segment (segmentId) {
  let segment = {
    segmentId,
    sequencerIds: [],
    playingState: PLAYING_STATES.STOPPED,
  };
  return segmentId;
}

export function create_initial_segment (segmentId) {
  let segment = create_default_segment(segmentId);
  return segment;
}

export function segment (state, action) {
  return state;
}
