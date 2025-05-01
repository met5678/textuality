import { Meteor } from 'meteor/meteor';
import { PlayerId } from '/imports/schemas/player';
import { TellerId } from '/imports/schemas/derby/teller';
import { RaceId } from '/imports/schemas/derby/race';
import RaceBets from './raceBets';
import Races from '../race/races';
import { RaceBetId, RaceBetStatus } from '/imports/schemas/derby/raceBet';
import { raceBetStartBet } from './methods/raceBet.startBet';

export const RACE_BET_CANCEL_REASONS = ['user', 'timeout', 'race'] as const;
export type RaceBetCancelReason = (typeof RACE_BET_CANCEL_REASONS)[number];

const RACE_BET_CANCEL_REASONS_MAP: Record<RaceBetCancelReason, RaceBetStatus> =
  {
    user: 'cancelled-user',
    timeout: 'cancelled-timeout',
    race: 'cancelled-race',
  };

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
    const raceBetId = await raceBetStartBet({
      player_id,
      teller_id,
      race_id,
    });
    return raceBetId;
  },

  'derby.raceBets.cancelBet': async (
    race_bet_id: RaceBetId,
    reason: RaceBetCancelReason,
  ) => {
    const status = RACE_BET_CANCEL_REASONS_MAP[reason];
    if (!status) return;

    await RaceBets.updateAsync(race_bet_id, {
      $set: { status },
    });
  },

  'derby.raceBets.doPayouts': async (race_id: string) => {
    const race = await Races.findOneAsync(race_id);
    if (!race) return;
  },

  'derby.raceBets.clearBets': async (race_id: string) => {
    await RaceBets.removeAsync({ race: race_id });
  },

  'derby.raceBets.getIncompleteBetForPlayer': async ({
    race_id,
    player_id,
  }: {
    race_id: RaceId;
    player_id: PlayerId;
  }) => {
    const raceBet = await RaceBets.findOneAsync({
      race: race_id,
      player: player_id,
      status: 'pending',
    });
    return raceBet;
  },
});
