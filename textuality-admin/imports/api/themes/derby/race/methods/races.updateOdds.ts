import RaceBets from '../../raceBets';
import Races from '../races';
import { HorseId } from '/imports/schemas/derby/horse';
import { RaceHorseOdds, RaceId } from '/imports/schemas/derby/race';
import { RaceBetType } from '/imports/schemas/derby/raceBet';

const BASE_SEED_MONEY = 100;

const MIN_ODDS = 2;
const MAX_ODDS = 99;

export const raceUpdateOdds = async (raceId: RaceId) => {
  const race = await Races.findOneAsync(raceId);
  const raceBets = await RaceBets.find({
    race: raceId,
    status: 'placed',
  }).fetchAsync();
  if (!race) {
    throw new Error('raceUpdateOdds: Race not found');
  }

  const wageredByHorse: Record<HorseId, number> = {};
  const wageredByBetType: Record<RaceBetType, number> = {
    win: BASE_SEED_MONEY,
    trifecta: BASE_SEED_MONEY,
  };
  for (const horse of race.horses) {
    wageredByHorse[horse] = BASE_SEED_MONEY;
  }
  for (const bet of raceBets) {
    if (
      bet.type === 'win' &&
      Array.isArray(bet.horses) &&
      bet.horses.length === 1
    ) {
      wageredByHorse[bet.horses[0]] += bet.totalWager();
      wageredByBetType.win += bet.totalWager();
    }
    if (
      bet.type === 'trifecta' &&
      Array.isArray(bet.horses) &&
      bet.horses.length === 3
    ) {
      wageredByHorse[bet.horses[0]] += bet.totalWager() / 2;
      wageredByHorse[bet.horses[1]] += bet.totalWager() / 3;
      wageredByHorse[bet.horses[2]] += bet.totalWager() / 6;
      wageredByBetType.trifecta += bet.totalWager();
    }
  }

  const totalWagered = Object.values(wageredByHorse).reduce(
    (acc, wager) => acc + wager,
    0,
  );

  const odds: RaceHorseOdds[] = [];
  for (const horse of race.horses) {
    odds.push({
      horse,
      odds: Math.min(
        MAX_ODDS,
        Math.max(MIN_ODDS, Math.round(totalWagered / wageredByHorse[horse])),
      ),
    });
  }

  Races.updateAsync(raceId, { $set: { odds } });
};
