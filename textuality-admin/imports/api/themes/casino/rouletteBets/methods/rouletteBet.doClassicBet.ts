import commaNumber from 'comma-number';
import { Meteor } from 'meteor/meteor';
import Roulettes from '../../roulettes';
import RouletteBets from '../rouletteBets';
import Events from '/imports/api/events';
import Players from '/imports/api/players';
import {
  isRouletteBetSlotSpecial,
  RouletteBetSlot,
} from '/imports/schemas/rouletteBet';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';

const CURRENCY = 'BB';

export const doClassicBet = async ({
  betCode,
  betWager,
  roulette_id,
  player_id,
}: {
  betCode: string;
  betWager: number;
  roulette_id: string;
  player_id: string;
}) => {
  const player = await Players.findOneAsync(player_id, {
    fields: { money: 1, alias: 1, avatar: 1 },
  });
  const roulette = await Roulettes.findOneAsync(roulette_id);
  const eventId = await Events.currentIdOrThrowAsync();

  if (!player || !roulette) return;

  if (Number.isNaN(betWager)) {
    sendAutoText({
      playerId: player._id,
      trigger: 'INVALID_BET',
    });
    return;
  }

  if (betWager === 0) {
    sendAutoText({
      playerId: player._id,
      trigger: 'ROULETTE_BET_ZERO',
    });
    return;
  }

  if (betWager < 0) {
    sendAutoText({
      playerId: player._id,
      trigger: 'INVALID_BET',
      templateVars: {
        bet_wager: betWager,
      },
    });
    return;
  }

  if (player.money < betWager) {
    sendAutoText({
      playerId: player._id,
      trigger: 'ROULETTE_NOT_ENOUGH_MONEY',
      templateVars: {
        bet_wager: betWager,
      },
    });
    return;
  }
  Meteor.call('players.takeMoney', { playerId: player_id, money: betWager });

  const bet_slot: RouletteBetSlot = isRouletteBetSlotSpecial(betCode)
    ? betCode
    : parseInt(betCode);

  const existingBet = await RouletteBets.findOneAsync({
    event: eventId,
    roulette_id,
    'player.id': player_id,
    bet_slot,
  });

  if (existingBet?._id) {
    await RouletteBets.updateAsync(existingBet._id, {
      $inc: {
        wager: betWager,
      },
      $set: {
        time: new Date(),
      },
    });
  } else {
    RouletteBets.insertAsync({
      event: eventId,
      bet_slot,
      roulette_id,
      wager: betWager,
      player: {
        id: player_id,
        alias: player.alias,
        avatar_id: player.avatar!,
        money: player.money,
      },
      win_payout: 0,
      time: new Date(),
      status: 'placed',
      step: 'done',
    });
  }

  const allPlayerBets = RouletteBets.find(
    {
      event: Events.currentId()!,
      roulette_id,
      'player.id': player_id,
    },
    {
      sort: {
        bet_slot: 1,
      },
    },
  ).fetch();

  const wagerLines = allPlayerBets.map((bet) => {
    return `${bet.bet_slot}: ${commaNumber(bet.wager!)} ${CURRENCY}`;
  });

  sendAutoText({
    playerId: player_id,
    trigger: 'ROULETTE_BET',
    templateVars: {
      bet_slot: betCode,
      bet_wager: betWager,
      all_bets: wagerLines.join('\n'),
    },
  });
};

export const doClassicBetMethod = getWrappedServerMethod(
  'rouletteBets.doClassicBet',
  doClassicBet,
);
