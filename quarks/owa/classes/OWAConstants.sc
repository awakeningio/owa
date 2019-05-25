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
    <>nextSessionPhases,
    <>transPhaseDurations,
    <>songIds,
    <>songIdsList,
    <>tempoBySongId,
    <>sessionPhaseBeatPerBarBySongId;

  *init {
    arg params;

    var convertToSymbol = {
      arg item, i;
      item.asSymbol();
    };

    OWAConstants.autoTransitionSessionPhases = params.constants['AUTO_TRANS_SESSION_PHASES'].collect(convertToSymbol);
    OWAConstants.sessionPhases = params.constants['SESSION_PHASES'].collect(convertToSymbol);
    OWAConstants.nextSessionPhases = params.constants['NEXT_SESSION_PHASES'].collect(convertToSymbol);
    OWAConstants.songIds = params.constants['SONG_IDS'].collect(convertToSymbol);
    OWAConstants.songIdsList = params.constants['SONG_IDS_LIST'].collect(convertToSymbol);
    OWAConstants.tempoBySongId = params.constants['TEMPO_BY_SONGID'];
    OWAConstants.sessionPhaseBeatPerBarBySongId = params.constants['SESSION_PHASE_BEATS_PER_BAR_BY_SONGID'];
  }
}
