import { SESSION_PHASES, NEXT_SESSION_PHASES } from 'owa/constants';

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

export function createPhaseEndQuant (sessionPhase, sessionPhaseDurations) {
  return [
    4,
    sessionPhaseDurations[sessionPhase]
  ];
}

export function createPhaseStartQuant (sessionPhase, sessionPhaseDurations) {
  return [
    4,
    sessionPhaseDurations[sessionPhase]
  ];
}

export function createNextPhaseEndQuant (sessionPhase, sessionPhaseDurations) {
  return [
    4,
    4 + sessionPhaseDurations[
      NEXT_SESSION_PHASES[sessionPhase]
    ],
  ];
}
