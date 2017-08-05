OWAConstants {
  classvar <>autoTransitionSessionPhases;

  *init {
    OWAConstants.autoTransitionSessionPhases = [
        'IDLE',
        'TRANS_10',
        'TRANS_8',
        'TRANS_6',
        'TRANS_4',
        'TRANS_ADVICE',
        'TRANS_IDLE'
      ];
  }
}
