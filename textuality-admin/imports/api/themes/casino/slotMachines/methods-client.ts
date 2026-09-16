import { Meteor } from 'meteor/meteor';

import SlotMachines from './slotMachines';
import Players from '/imports/api/players';
import { SlotMachine, SlotMachineResult } from '/imports/schemas/slotMachine';
import waitForSeconds from '/imports/api/rounds/reveal-sequence/_wait-for-seconds';
import {
  throwIfCancelledTimeout,
  TimeoutError,
} from './spin-sequence/_slot-timeouts';

// Once a spin starts, it'll need to go through a process:
//

Meteor.methods({
  'slotMachines.doHackerSpin': async ({
    slot_id,
    player_id,
    is_final,
    quest_id,
  }) => {
    const slotMachine = SlotMachines.findOne(slot_id);
    const player = Players.findOne(player_id);
    if (!slotMachine || !player) return;

    const result: SlotMachineResult = ['💣', '💣', '💣'];
    const payout_multiplier = 1;

    const win_amount = slotMachine.cost * payout_multiplier;

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

    let final_win_amount = win_amount;
    if (is_final) {
      const quest = Meteor.call('quests.completeQuest', {
        playerId: player_id,
        questId: quest_id,
      });
      final_win_amount = quest?.slot_quest?.win_amount ?? 0;
    }

    const slotStatus = is_final ? 'win-hacker-final' : 'win-hacker-partial';

    console.log('Made it here', {
      slot_id,
      slotStatus,
      player_id,
      final_win_amount,
      is_final,
    });

    SlotMachines.update(slot_id, {
      $set: {
        status: slotStatus,
        'player.money': player.money - slotMachine.cost + final_win_amount,
        win_amount: final_win_amount,
      },
    });

    if (!is_final) {
      Meteor.call('players.giveMoney', {
        playerId: player_id,
        money: final_win_amount,
      });
      Meteor.call('autoTexts.send', {
        trigger: 'SLOT_WIN_HACKER_PARTIAL',
        playerId: player_id,
        templateVars: {
          slot_name: slotMachine.name,
          slot_payout: final_win_amount.toString(),
        },
      });
    }

    try {
      await throwIfCancelledTimeout(slot_id, is_final ? 10 : 5);
    } catch (error) {
      if (error === TimeoutError) return;
      throw error;
    }

    SlotMachines.update(slot_id, {
      $set: { status: 'available' },
      $unset: { player: 1, win_amount: 1, result: 1 },
    });
  },
});
