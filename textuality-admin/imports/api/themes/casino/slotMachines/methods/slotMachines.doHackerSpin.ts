import { Meteor } from 'meteor/meteor';
import { completeQuest } from '../../quests/methods/quests.completeQuest';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import Players from '/imports/api/players';
import { playerGiveMoney } from '/imports/api/players/methods/players.giveMoney';
import SlotMachines from '/imports/api/themes/casino/slotMachines';
import {
  throwIfCancelledTimeout,
  TimeoutError,
} from '/imports/api/themes/casino/slotMachines/spin-sequence/_slot-timeouts';
import { PlayerId } from '/imports/schemas/player';
import { QuestId } from '/imports/schemas/quest';
import {
  SlotMachine,
  SlotMachineId,
  SlotMachineResult,
} from '/imports/schemas/slotMachine';
import { waitForSeconds } from '/imports/utils/async-wait-for';

type DoHackerSpinArgs = {
  slot_id: SlotMachineId;
  player_id: PlayerId;
  is_final: boolean;
  quest_id?: QuestId;
};

export const slotMachineDoHackerSpin = async ({
  slot_id,
  player_id,
  is_final,
  quest_id,
}: DoHackerSpinArgs) => {
  const [slotMachine, player] = await Promise.all([
    SlotMachines.findOneAsync(slot_id),
    Players.findOneAsync(player_id),
  ]);
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

  void sendAutoText({
    trigger: 'SLOT_SPIN',
    playerId: player_id,
    templateVars: {
      slot_name: slotMachine.name,
    },
  });
  Meteor.call('players.recordSlotSpin', { player_id, slot_id, win_amount });
  await SlotMachines.updateAsync(slot_id, { $set: slotMachineUpdate });
  await waitForSeconds(5);

  let final_win_amount = win_amount;
  if (is_final && quest_id) {
    const quest = await completeQuest({
      playerId: player_id,
      questId: quest_id,
      cheated: false,
    });
    final_win_amount = quest?.slot_quest?.win_amount ?? 0;
  }

  const slotStatus = is_final ? 'win-hacker-final' : 'win-hacker-partial';

  await SlotMachines.updateAsync(slot_id, {
    $set: {
      status: slotStatus,
      'player.money': player.money - slotMachine.cost + final_win_amount,
      win_amount: final_win_amount,
    },
  });

  if (!is_final) {
    void playerGiveMoney({
      playerId: player_id,
      money: final_win_amount,
    });
    void sendAutoText({
      trigger: 'SLOT_WIN_HACKER_PARTIAL',
      playerId: player_id,
      templateVars: {
        slot_name: slotMachine.name,
        slot_payout: final_win_amount.toString(),
      },
    });
  }

  try {
    await throwIfCancelledTimeout(slot_id, is_final ? 5 : 5);
  } catch (error) {
    if (error === TimeoutError) return;
    throw error;
  }

  await SlotMachines.updateAsync(slot_id, {
    $set: { status: 'available' },
    $unset: { player: 1, win_amount: 1, result: 1 },
  });
};
