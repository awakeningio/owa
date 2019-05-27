import { SESSION_PHASES, SESSION_PHASE_BEATS_PER_BAR_BY_SONGID, SESSION_PHASE_DURATIONS_BY_SONGID } from 'owa/constants';

// A mapping of session phase to properties which are to be applied
// when the session phase occurs.
export function createPhaseProps (defaults = {}) {
  return Object.keys(SESSION_PHASES).reduce(
    function (phaseProps, sessionPhase) {
      phaseProps[sessionPhase] = defaults[sessionPhase] || {};
      return phaseProps
    },
    {}
  );
}

export function get_playing_levelId_for_sessionPhase (sessionPhase) {
  return {
    [SESSION_PHASES.PLAYING_6]: 'level_6',
    [SESSION_PHASES.PLAYING_4]: 'level_4',
    [SESSION_PHASES.PLAYING_2]: 'level_2'
  }[sessionPhase] || null;
}

export function createPhaseEndQuant (sessionPhase, songId, endOfBar=false) {
  const sessionPhaseDuration = SESSION_PHASE_DURATIONS_BY_SONGID[songId][sessionPhase];
  const sessionPhaseMeter = SESSION_PHASE_BEATS_PER_BAR_BY_SONGID[songId][sessionPhase];
  return [
    sessionPhaseMeter,
    sessionPhaseDuration + (endOfBar ? sessionPhaseMeter : 0)
  ];
}

//export function createNextPhaseStartQuant (sessionPhase, songId) {
  //const nextPhase = NEXT_SESSION_PHASES[sessionPhase];
  //const nextPhaseMeter = SESSION_PHASE_BEATS_PER_BAR_BY_SONGID[songId][nextPhase];

//}

//export function createNextPhaseEndQuant (sessionPhase, songId, endOfBar=false) {
  //const sessionPhaseDuration = SESSION_PHASE_DURATIONS_BY_SONGID[songId][sessionPhase];
  //const sessionPhaseMeter = SESSION_PHASE_BEATS_PER_BAR_BY_SONGID[songId][sessionPhase];
  //const nextSessionPhase = NEXT_SESSION_PHASES[sessionPhase];
  //const nextSessionPhaseMeter = SESSION_PHASE_BEATS_PER_BAR_BY_SONGID[songId][nextSessionPhase];
  //const nextSessionPhaseDuration = SESSION_PHASE_DURATIONS_BY_SONGID[songId][nextSessionPhase];
  //return [
    //nextSessionPhaseMeter,
    //sessionPhaseDuration + nextSessionPhaseDuration + (endOfBar ? nextSessionPhaseMeter : 0)
  //];
//}
