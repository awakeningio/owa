/**
 *  @file       OWAConstants.sc
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

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
      'TRANS_2',
      'TRANS_ADVICE',
      'TRANS_IDLE'
    ];
    OWAConstants.sessionPhases = params.constants['SESSION_PHASES'];
    OWAConstants.nextSessionPhases = params.constants['NEXT_SESSION_PHASES'];
  }
}
