import { Meteor } from 'meteor/meteor';

import RouletteBets, { RouletteBetWithHelpers } from './rouletteBets';
import Players from '/imports/api/players';
import Roulettes from '../roulettes';
import Events from '/imports/api/events';
import { RouletteBet, RouletteBetSlot } from '/imports/schemas/rouletteBet';
import getSpecialBetSlotsForResult from './get-special-bet-slots-for-result';
import { RouletteWithHelpers } from '../roulettes/roulettes';

Meteor.methods({
  'rouletteBets.makeBet': ({
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
    const player = Players.findOne(player_id, {
      fields: { money: 1, alias: 1, avatar: 1 },
    });
    const roulette = Roulettes.findOne(roulette_id);

    if (!player || !roulette) return;

    if (Number.isNaN(betWager)) {
      Meteor.call('autoTexts.send', {
        playerId: player._id,
        trigger: 'INVALID_BET',
      });
      return;
    }

    if (betWager === 0) {
      Meteor.call('autoTexts.send', {
        playerId: player._id,
        trigger: 'ROULETTE_BET_ZERO',
      });
      return;
    }

    if (betWager < 0) {
      Meteor.call('autoTexts.send', {
        playerId: player._id,
        trigger: 'INVALID_BET',
        templateVars: {
          bet_wager: betWager,
        },
      });
      return;
    }

    if (player.money < betWager) {
      Meteor.call('autoTexts.send', {
        playerId: player._id,
        trigger: 'ROULETTE_NOT_ENOUGH_MONEY',
        templateVars: {
          bet_wager: betWager,
        },
      });
      return;
    }
    Meteor.call('players.takeMoney', { playerId: player_id, money: betWager });

    const bet_slot: RouletteBetSlot = ['even', 'odd', 'red', 'black'].includes(
      betCode,
    )
      ? betCode
      : parseInt(betCode);

    const existingBet = RouletteBets.findOne({
      event: Events.currentId()!,
      roulette_id,
      'player.id': player_id,
      bet_slot,
    });

    if (existingBet?._id) {
      RouletteBets.update(existingBet._id, {
        $inc: {
          wager: betWager,
        },
        $set: {
          time: new Date(),
        },
      });
    } else {
      RouletteBets.insert({
        event: Events.currentId()!,
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
      return `${bet.bet_slot}: ${bet.wager} BB`;
    });

    Meteor.call('autoTexts.send', {
      trigger: 'ROULETTE_BET',
      playerId: player_id,
      templateVars: {
        bet_slot: betCode,
        bet_wager: betWager,
        all_bets: wagerLines.join('\n'),
      },
    });
  },

  'rouletteBets.doPayouts': (roulette_id: string) => {
    const roulette = Roulettes.findOne(roulette_id);
    if (!roulette || !roulette.result) return;

    const bets = RouletteBets.find({ roulette_id }).fetch();

    const playersDict: Record<string, RouletteBetWithHelpers[]> = {};

    bets.forEach((bet) => {
      if (!playersDict[bet.player.id]) playersDict[bet.player.id] = [];
      playersDict[bet.player.id].push(bet);
    });

    const specialSlots = getSpecialBetSlotsForResult(roulette.result);

    Object.entries(playersDict).forEach(([playerId, playerBets]) => {
      processBetsForPlayer(playerId, playerBets, specialSlots, roulette);
    });
  },

  'rouletteBets.clearBets': (roulette_id: string) => {
    RouletteBets.remove({ roulette_id });
  },
});

const processBetsForPlayer = (
  playerId: string,
  playerBets: RouletteBetWithHelpers[],
  specialSlots: RouletteBetSlot[],
  roulette: RouletteWithHelpers,
) => {
  const playerWinningBets = playerBets.filter((bet) => {
    if (String(bet.bet_slot) === String(roulette.result)) return true;
    if (specialSlots.includes(bet.bet_slot)) return true;
    return false;
  });

  const totalSpent = playerBets.reduce((total, bet) => total + bet.wager, 0);

  if (!playerWinningBets.length) {
    Meteor.call('autoTexts.send', {
      playerId,
      trigger: 'ROULETTE_LOSE',
      templateVars: {
        number: roulette.result,
        money_lost: totalSpent,
      },
    });
    return;
  }

  const hasNumberWin = playerWinningBets.some((bet) => bet.isNumberBet());

  playerWinningBets.forEach((bet) => {
    if (bet.isNumberBet()) {
      bet.win_payout = Math.round(
        bet.wager * roulette.number_payout_multiplier,
      );
      RouletteBets.update(bet._id!, { $set: { win_payout: bet.win_payout } });
    } else {
      bet.win_payout = Math.round(
        bet.wager * roulette.special_payout_multiplier,
      );
      RouletteBets.update(bet._id!, { $set: { win_payout: bet.win_payout } });
    }
  });

  const totalPayout = playerWinningBets.reduce(
    (total, bet) => total + bet.win_payout,
    0,
  );

  const payoutDetailText = playerWinningBets.map((bet) => {
    if (bet.isSpecialBet())
      return `${bet.wager} BB on ${bet.bet_slot} (x${roulette.special_payout_multiplier}) nets ${bet.win_payout} BB`;
    return `${bet.wager} BB on ${bet.bet_slot} (x${roulette.number_payout_multiplier}) nets ${bet.win_payout} BB`;
  });

  Meteor.call('players.giveMoney', {
    playerId,
    money: totalPayout,
  });
  if (hasNumberWin) {
    Meteor.call('autoTexts.send', {
      playerId,
      trigger: 'ROULETTE_WIN_NUMBER',
      templateVars: {
        money_won: totalPayout,
        number: roulette.result,
        payout_detail: payoutDetailText.join('\n'),
      },
    });
  } else {
    Meteor.call('autoTexts.send', {
      playerId,
      trigger: 'ROULETTE_WIN_SMALL',
      templateVars: {
        money_won: totalPayout,
        number: roulette.result,
        payout_detail: payoutDetailText.join('\n'),
      },
    });
  }
};
