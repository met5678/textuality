import { Meteor } from 'meteor/meteor';

import Players from '../../players';
import { InText } from '/imports/schemas/inText';
import RouletteBetSchema from '/imports/schemas/rouletteBet';
import { PlayerWithHelpers } from '../../players/players';
import { DateTime } from 'luxon';

const isRouletteFormat = function (betCode: string): boolean {
  const allowedValues = ['even', 'odd', 'red', 'black'];
  if (allowedValues.includes(betCode)) return true;

  try {
    const num = Number.parseInt(betCode);
    if (num >= 0 && num <= 36) return true;
  } catch (e) {}

  return false;
};

const handleRouletteBet = function ({
  betCode,
  rest,
  player,
}: {
  betCode: string;
  rest: string;
  player: PlayerWithHelpers;
}): void {
  const curRoulette = Meteor.call('roulettes.findCurrent');
  const nextRoulette = Meteor.call('roulettes.findNext');
  if (!curRoulette) {
    if (nextRoulette && nextRoulette.bets_start_at) {
      Meteor.call('autoTexts.send', {
        playerId: player._id,
        trigger: 'ROULETTE_NOT_YET_ACCEPTING',
        templateVars: {
          bets_start_at: DateTime.fromJSDate(
            nextRoulette.bets_start_at,
          ).toLocaleString(DateTime.TIME_SIMPLE),
          spin_starts_at: DateTime.fromJSDate(
            nextRoulette.spin_starts_at,
          ).toLocaleString(DateTime.TIME_SIMPLE),
        },
      });
    } else {
      Meteor.call('autoTexts.send', {
        playerId: player._id,
        trigger: 'ROULETTE_NO_MORE',
        templateVars: {
          betCode,
        },
      });
    }

    return;
  }

  if (curRoulette.bets_open) {
    let betWager = Number.parseInt(rest.trim());

    Meteor.call('rouletteBets.makeBet', {
      roulette_id: curRoulette._id,
      player_id: player._id,
      betCode,
      betWager,
    });
  } else {
    Meteor.call('autoTexts.send', {
      playerId: player._id,
      trigger: 'ROULETTE_BET_TOO_LATE',
    });
  }
};

const processPercentText = function (inText: InText) {
  const player = Players.findOne(inText.player);
  if (!player) return;

  const playerId = player._id;

  const firstSpace =
    inText.body.indexOf(' ') > 0
      ? inText.body.indexOf(' ')
      : inText.body.length;
  const betCode = inText.body.substring(1, firstSpace).trim().toLowerCase();
  const rest = inText.body.substring(firstSpace);

  if (isRouletteFormat(betCode)) {
    handleRouletteBet({ betCode, rest, player });
    return;
  }

  const slotMachine = Meteor.call('slotMachines.getForShort', betCode);
  if (slotMachine) {
    Meteor.call('slotMachines.spinRequest', {
      slot_id: slotMachine._id,
      player_id: playerId,
      inText_id: inText._id,
    });
    return;
  }

  Meteor.call('autoTexts.send', {
    playerId,
    trigger: 'INVALID_BET',
    templateVars: {
      betCode,
    },
  });
};

export default processPercentText;
