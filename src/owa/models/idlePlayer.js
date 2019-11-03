import SCReduxSequencers from 'supercollider-redux-sequencers';

export function createIdlePlayer () {
  return {
    gate: 0,
    playingState: SCReduxSequencers.PLAYING_STATES.STOPPED
  };
}
