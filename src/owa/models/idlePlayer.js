import awakeningSequencers from 'awakening-sequencers';

export function createIdlePlayer () {
  return {
    gate: 0,
    playingState: awakeningSequencers.PLAYING_STATES.STOPPED
  };
}
