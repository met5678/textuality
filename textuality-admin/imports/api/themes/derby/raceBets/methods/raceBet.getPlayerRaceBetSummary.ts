import commaNumber from 'comma-number';
import { condenseRaceBets } from '../helpers';
import { RaceId } from '/imports/schemas/derby/race';
import { PlayerId } from '/imports/schemas/player';
import Horses, { HorseWithHelpers } from '../../horses/horses';
import { HorseId } from '/imports/schemas/derby/horse';
import { RACE_BET_STATUS, RaceBetStatus } from '/imports/schemas/derby/raceBet';
import RaceBets from '../raceBets';

const getHorseEmoji = (horseId: HorseId, horses: HorseWithHelpers[]) => {
  const horse = horses.find((h) => h._id === horseId);
  if (!horse) {
    return '';
  }
  return horse.emojiColorSquare;
};

export const raceBetGetPlayerRaceBetSummary = async (
  playerId: PlayerId,
  raceId: RaceId,
  statuses: RaceBetStatus[] = [...RACE_BET_STATUS],
) => {
  const raceBets = await RaceBets.find({
    player: playerId,
    race: raceId,
    status: { $in: statuses },
  }).fetch();

  console.log('raceBets', raceBets);

  const horses = await Horses.find({
    _id: { $in: raceBets.map((b) => b.horses ?? []).flat() },
  }).fetch();

  const condensedBets = condenseRaceBets(raceBets);

  console.log('condensedBets', condensedBets);

  // sort by total wager, descending
  const sortedBets = condensedBets.sort(
    (a, b) => b.totalWager() - a.totalWager(),
  );

  return sortedBets
    .map((bet) => {
      const horseEmojis = bet.horses?.map((h) => getHorseEmoji(h, horses));
      return `${commaNumber(bet.totalWager())} DD on ${horseEmojis?.join(
        ' ',
      )} ${bet.type === 'win' ? 'to win' : 'Trifecta'}`;
    })
    .join('\n');
};
