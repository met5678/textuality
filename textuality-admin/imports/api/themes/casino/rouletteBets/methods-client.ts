import { Meteor } from 'meteor/meteor';

import RouletteBets from './rouletteBets';
import Players from '/imports/api/players';
import Roulettes from '../roulettes';
import Events from '/imports/api/events';
import { RouletteBetSlot } from '/imports/schemas/rouletteBet';

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

    if (player.money < betWager) {
      Meteor.call('autoTexts.send', {
        playerId: player._id,
        trigger: 'ROULETTE_NOT_ENOUGH_MONEY',
        templateVars: {
          bet_wager: betWager,
        },
      });
    }
    Meteor.call('players.takeMoney', { playerId: player_id, money: betWager });

    const bet_slot: RouletteBetSlot = ['even', 'odd', 'red', 'black'].includes(
      betCode,
    )
      ? betCode
      : Number.parseInt(betCode);

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
});
