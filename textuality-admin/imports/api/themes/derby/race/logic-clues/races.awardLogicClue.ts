import { PlayerId } from '/imports/schemas/player';

import Players from '/imports/api/players';
import Events from '/imports/api/events';
import Races from '../races';
import { RaceHorseResult } from '/imports/schemas/derby/race';
import Horses, { HorseWithHelpers } from '../../horses/horses';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { HorseId } from '/imports/schemas/derby/horse';
import ordinal from 'ordinal';
import { racesGetCurrent } from '../methods/races.getCurrent';

const CLUE_TYPES = [
  'ADJACENT_HORSE',
  'ADJACENT_HORSE',
  'ADJACENT_HORSE',
  'ONE_OF_TWO_PLACES',
  'ONE_OF_TWO_PLACES',
];

const getHorse = (horseId: HorseId, horses: HorseWithHelpers[]) => {
  return horses.find((horse) => horse._id === horseId) as HorseWithHelpers;
};

const sendAdjacentHorseClue = (
  results: RaceHorseResult[],
  horses: HorseWithHelpers[],
  playerId: PlayerId,
) => {
  // Sort the results by placement
  const sortedResults = results.sort((a, b) => a.placement - b.placement);

  const firstAdjacentHorseIdx = Math.floor(
    Math.random() * (results.length - 1),
  );
  const secondAdjacentHorseIdx = firstAdjacentHorseIdx + 1;

  const swap = Math.random() < 0.5;
  const horse1 = swap
    ? sortedResults[firstAdjacentHorseIdx].horse
    : sortedResults[secondAdjacentHorseIdx].horse;
  const horse2 = swap
    ? sortedResults[secondAdjacentHorseIdx].horse
    : sortedResults[firstAdjacentHorseIdx].horse;

  sendAutoText({
    trigger: 'RACE_LOGIC_ADJACENT_HORSE',
    playerId: playerId,
    templateVars: {
      horse1_fullname: getHorse(horse1, horses).formattedName(),
      horse2_fullname: getHorse(horse2, horses).formattedName(),
    },
  });
};

const MINIMUM_CORRECT_PLACEMENT = 4;

const sendOneOfTwoPlacesClue = (
  results: RaceHorseResult[],
  horses: HorseWithHelpers[],
  playerId: PlayerId,
) => {
  const randomHorseResult =
    results[
      Math.floor(Math.random() * (results.length - MINIMUM_CORRECT_PLACEMENT)) +
        MINIMUM_CORRECT_PLACEMENT
    ];

  const correctPlace = randomHorseResult.placement;
  let otherPlace: number;
  do {
    otherPlace = Math.floor(Math.random() * results.length);
  } while (otherPlace === correctPlace);

  const swap = Math.random() < 0.5;
  const place1 = swap ? correctPlace : otherPlace;
  const place2 = swap ? otherPlace : correctPlace;

  sendAutoText({
    trigger: 'RACE_LOGIC_ONE_OF_TWO_PLACES',
    playerId: playerId,
    templateVars: {
      horse_fullname: getHorse(randomHorseResult.horse, horses).formattedName(),
      place1: ordinal(place1),
      place2: ordinal(place2),
    },
  });
};

export const raceAwardLogicClue = async (playerId: PlayerId) => {
  const player = await Players.findOneAsync(playerId);
  if (!player) return;

  const race = await racesGetCurrent();
  if (!race) return;

  const horses = await Horses.find({ _id: { $in: race.horses } }).fetchAsync();

  if (!race.results.length) return;

  const clueType = CLUE_TYPES[Math.floor(Math.random() * CLUE_TYPES.length)];

  if (clueType === 'ADJACENT_HORSE') {
    sendAdjacentHorseClue(race.results, horses, playerId);
  } else if (clueType === 'ONE_OF_TWO_PLACES') {
    sendOneOfTwoPlacesClue(race.results, horses, playerId);
  }
};
