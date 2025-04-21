import { Meteor } from 'meteor/meteor';
import { PlayerId } from '/imports/schemas/player';
import { TellerId } from '/imports/schemas/derby/teller';
import { RaceId } from '/imports/schemas/derby/race';
import RaceBets from './raceBets';
import Players from '/imports/api/players';
import Races from '../race/races';
import {
  RaceBet,
  RaceBetId,
  RaceBetType,
} from '/imports/schemas/derby/raceBet';

Meteor.methods({
  'derby.raceBets.startBet': async ({
    player_id,
    teller_id,
    race_id,
  }: {
    player_id: PlayerId;
    teller_id: TellerId;
    race_id: RaceId;
  }) => {
    const player = Players.findOneAsync(player_id, {
      fields: { money: 1, alias: 1, avatar: 1 },
    });
  },

  'derby.raceBets.selectBetType': async ({
    race_bet_id,
    bet_type,
  }: {
    race_bet_id: RaceBetId;
    bet_type: RaceBetType;
  }) => {
    const raceBet = await RaceBets.findOneAsync(race_bet_id);
    if (!raceBet) return;
    await RaceBets.updateAsync(race_bet_id, { $set: { bet_type } });
  },

  'derby.raceBets.updateBet': async (
    race_bet_id: RaceBetId,
    bet: Partial<Pick<RaceBet, 'wager' | 'type' | 'horses'>>,
  ) => {
    const raceBet = await RaceBets.findOneAsync(race_bet_id);
    if (!raceBet) return;
    await RaceBets.updateAsync(race_bet_id, { $set: { bet } });
  },

  'derby.raceBets.placeBet': async (race_bet_id: RaceBetId) => {
    const raceBet = await RaceBets.findOneAsync(race_bet_id);
    if (!raceBet) return;
    if (!validateRaceBet(raceBet)) return;

    await RaceBets.updateAsync(race_bet_id, {
      $set: { placed_at: new Date(), status: 'placed' },
      $unset: { step: '' },
    });

    await Meteor.callAsync('derby.races.updateOdds', raceBet.race);
  },

  'derby.raceBets.doPayouts': async (race_id: string) => {
    const race = await Races.findOneAsync(race_id);
    if (!race) return;
  },

  'derby.raceBets.clearBets': async (race_id: string) => {
    await RaceBets.removeAsync({ race: race_id });
  },
});

const validateRaceBet = async (raceBet: RaceBet) => {
  const race = await Races.findOneAsync(raceBet.race);
  if (!race) return;
  if (race.status !== 'bets-open') return false;

  if (raceBet.type === 'win') {
    if (raceBet.horses.length !== 1) return false;
  } else if (['exacta', 'exacta-box'].includes(raceBet.type)) {
    if (raceBet.horses.length !== 2) return false;
  } else if (['trifecta', 'trifecta-box'].includes(raceBet.type)) {
    if (raceBet.horses.length !== 3) return false;
  }

  if (raceBet.wager <= 0) return false;

  return true;
};
