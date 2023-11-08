import { Meteor } from 'meteor/meteor';

import SlotMachines from './slotMachines';
import Events from '/imports/api/events';
import Players from '/imports/api/players';
import {
  SlotMachine,
  SlotMachineEmojis,
  SlotMachineOdds,
  SlotMachineResult,
} from '/imports/schemas/slotMachine';
import waitForSeconds from '/imports/api/rounds/reveal-sequence/_wait-for-seconds';

// Once a spin starts, it'll need to go through a process:
//

Meteor.methods({
  'slotMachines.getForShort': (short: string) => {
    short = short.toLowerCase();
    const slotMachine = SlotMachines.findOne({
      event: Events.currentId()!,
      short,
    });
    if (!slotMachine) return;
    return slotMachine;
  },

  'slotMachines.spinRequest': async ({
    slot_id,
    player_id,
    inText_id,
  }: {
    slot_id: string;
    player_id: string;
    inText_id: string;
  }) => {
    const slotMachine = SlotMachines.findOne(slot_id);
    const player = Players.findOne(player_id);

    if (!slotMachine || !player) {
      return;
    }

    if (slotMachine.status !== 'available') {
      const templateVars: Record<string, string> = {
        slot_name: slotMachine.name,
      };
      if (slotMachine.player) {
        templateVars.other_player_alias = slotMachine.player.alias;
      }

      Meteor.call('autoTexts.send', {
        trigger: 'SLOT_BUSY',
        playerId: player_id,
        templateVars,
      });
      return;
    }

    if (player.money < slotMachine.cost) {
      Meteor.call('autoTexts.send', {
        trigger: 'SLOT_NOT_ENOUGH_MONEY',
        playerId: player_id,
        templateVars: {
          slot_name: slotMachine.name,
          slot_cost: slotMachine.cost.toString(),
          short_money: slotMachine.cost - player.money,
        },
      });
      return;
    }

    Meteor.call('players.takeMoney', {
      playerId: player_id,
      money: slotMachine.cost,
    });

    const { result, win, payout_multiplier } = generateResult(slotMachine);
    const win_amount = win ? slotMachine.cost * payout_multiplier : 0;

    const slotMachineUpdate: Partial<SlotMachine> = {
      status: 'spinning',
      result,
      win_amount,
      player: {
        id: player_id,
        alias: player.alias,
        money: player.money - slotMachine.cost,
        avatar_id: player.avatar!,
      },
      stats: {
        profit: slotMachine.stats.profit + slotMachine.cost - win_amount,
        spin_count: slotMachine.stats.spin_count + 1,
      },
    };

    Meteor.call('autoTexts.send', {
      trigger: 'SLOT_SPIN',
      playerId: player_id,
      templateVars: {
        slot_name: slotMachine.name,
      },
    });
    Meteor.call('players.recordSlotSpin', { player_id, slot_id, win_amount });
    SlotMachines.update(slot_id, { $set: slotMachineUpdate });
    await waitForSeconds(5);

    if (win) {
      SlotMachines.update(slot_id, {
        $set: {
          status: 'win-normal',
          'player.money': player.money - slotMachine.cost + win_amount,
        },
      });
      Meteor.call('players.giveMoney', {
        playerId: player_id,
        money: win_amount,
      });

      const trigger = getAutotextWinTriggerForPayout(payout_multiplier);
      Meteor.call('autoTexts.send', {
        trigger,
        playerId: player_id,
        templateVars: {
          slot_name: slotMachine.name,
          slot_cost: slotMachine.cost.toString(),
          slot_payout: win_amount.toString(),
          slot_result: result.join('-'),
        },
      });
      await waitForSeconds(7);
    } else {
      SlotMachines.update(slot_id, { $set: { status: 'lose' } });
      Meteor.call('autoTexts.send', {
        trigger: 'SLOT_LOSE',
        playerId: player_id,
        templateVars: {
          slot_name: slotMachine.name,
          slot_cost: slotMachine.cost.toString(),
          slot_result: result.join('-'),
        },
      });
      await waitForSeconds(4);
    }

    SlotMachines.update(slot_id, {
      $set: { status: 'available' },
      $unset: { player: 1, win_amount: 1, result: 1 },
    });
  },
});

interface SlotMachineResultWithPayout {
  result: SlotMachineResult;
  win: boolean;
  payout_multiplier: number;
}

const generateResult = (
  slotMachine: SlotMachine,
): SlotMachineResultWithPayout => {
  const random = Math.random();

  let totalOdds = 0;
  for (const odd of slotMachine.odds) {
    totalOdds += odd.odds;

    if (random <= totalOdds) {
      return {
        result: odd.result,
        win: true,
        payout_multiplier: odd.payout_multiplier,
      };
    }
  }

  return {
    result: getRandomLosingResult(),
    win: false,
    payout_multiplier: 0,
  };
};

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomLosingResult = (): SlotMachineResult => {
  const randIdx1 = getRandomInt(0, SlotMachineEmojis.length - 1);
  const randIdx2 = getRandomInt(0, SlotMachineEmojis.length - 1);
  const randIdx3 = (randIdx2 + 1) % SlotMachineEmojis.length;

  return [
    SlotMachineEmojis[randIdx1],
    SlotMachineEmojis[randIdx2],
    SlotMachineEmojis[randIdx3],
  ];
};

const getAutotextWinTriggerForPayout = (payout_multiplier: number): string => {
  if (payout_multiplier >= 10) return 'SLOT_WIN_BIG';
  if (payout_multiplier >= 4) return 'SLOT_WIN_MEDIUM';
  return 'SLOT_WIN_SMALL';
};
