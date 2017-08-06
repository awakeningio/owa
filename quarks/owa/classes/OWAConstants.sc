OWAConstants {
  classvar <>autoTransitionSessionPhases,
    <>sessionPhases,
    <>nextSessionPhases;

  *init {
    arg params;
    OWAConstants.autoTransitionSessionPhases = [
      'TRANS_10',
      'TRANS_8',
      'TRANS_6',
      'TRANS_4',
      'TRANS_ADVICE',
      'TRANS_IDLE'
    ];
    OWAConstants.sessionPhases = params.constants['SESSION_PHASES'];
    OWAConstants.nextSessionPhases = params.constants['NEXT_SESSION_PHASES'];
  }
}
