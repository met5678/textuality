import { Meteor } from 'meteor/meteor';
import SlotMachines from '../slotMachines';
import Players from '/imports/api/players';
import {
  SlotMachine,
  SLOT_MACHINE_EMOJIS,
  SlotMachineResult,
  SlotMachineStatus,
} from '/imports/schemas/slotMachine';
import { waitForSeconds } from '/imports/utils/async-wait-for';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { playerGiveMoney } from '/imports/api/players/methods/players.giveMoney';
import { AutoTextCasinoTrigger } from '/imports/schemas/autoText';
import { playerTakeMoney } from '/imports/api/players/methods/players.takeMoney';
import { getSlotRespinInteractive } from '../utils/get-slot-respin-interactive';
import {
  cancelAndDeleteTimeout,
  throwIfCancelledTimeout,
  TimeoutError,
} from '../spin-sequence/_slot-timeouts';

type SlotMachineResultWithPayout = {
  result: SlotMachineResult;
  win: boolean;
  payout_multiplier: number;
};

const SLOT_STATUS_ALLOWING_SPINS: SlotMachineStatus[] = [
  'available',
  'lose',
  'win-normal',
];

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
  const randIdx1 = getRandomInt(0, SLOT_MACHINE_EMOJIS.length - 1);
  const randIdx2 = getRandomInt(0, SLOT_MACHINE_EMOJIS.length - 1);
  const randIdx3 = (randIdx2 + 1) % SLOT_MACHINE_EMOJIS.length;

  return [
    SLOT_MACHINE_EMOJIS[randIdx1],
    SLOT_MACHINE_EMOJIS[randIdx2],
    SLOT_MACHINE_EMOJIS[randIdx3],
  ];
};

const getAutotextWinTriggerForPayout = (
  payout_multiplier: number,
): AutoTextCasinoTrigger => {
  if (payout_multiplier >= 10) return 'SLOT_WIN_BIG';
  if (payout_multiplier >= 4) return 'SLOT_WIN_MEDIUM';
  return 'SLOT_WIN_SMALL';
};

export const processSlotSpinRequest = async ({
  slot_id,
  player_id,
}: {
  slot_id: string;
  player_id: string;
}) => {
  const slotMachine = await SlotMachines.findOneAsync(slot_id);
  const player = await Players.findOneAsync(player_id);

  if (!slotMachine || !player) {
    return;
  }

  if (!SLOT_STATUS_ALLOWING_SPINS.includes(slotMachine.status)) {
    const templateVars: Record<string, string> = {
      slot_name: slotMachine.name,
    };
    if (slotMachine.player) {
      templateVars.other_player_alias = slotMachine.player.alias;
    }

    sendAutoText({
      trigger: 'SLOT_BUSY',
      playerId: player_id,
      templateVars,
    });
    return;
  }

  if (player.money === 0) {
    sendAutoText({
      trigger: 'SLOT_NO_MONEY',
      playerId: player_id,
      templateVars: {
        slot_name: slotMachine.name,
        slot_cost: slotMachine.cost.toString(),
        short_money: slotMachine.cost - player.money,
      },
    });
    return;
  }

  if (player.money < slotMachine.cost) {
    sendAutoText({
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

  // This spin has been accepted, so prevent the previous result screen from
  // clearing this spin when its timeout finishes.
  cancelAndDeleteTimeout(slot_id);

  playerTakeMoney({
    playerId: player_id,
    money: slotMachine.cost,
  });

  const {
    hackerSpin,
    hackerWin,
    quest_id,
  }: { hackerSpin: boolean; hackerWin: boolean; quest_id?: string } =
    Meteor.call('quests.checkForHackerSpin', {
      player_id,
      slot_id,
    });

  if (hackerSpin) {
    Meteor.call('slotMachines.doHackerSpin', {
      player_id,
      slot_id,
      is_final: hackerWin,
      quest_id,
    });
    return;
  }

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

  sendAutoText({
    trigger: 'SLOT_SPIN',
    playerId: player_id,
    templateVars: {
      slot_name: slotMachine.name,
    },
  });
  Meteor.call('players.recordSlotSpin', { player_id, slot_id, win_amount });
  await SlotMachines.updateAsync(slot_id, { $set: slotMachineUpdate });
  await waitForSeconds(5);

  let resultScreenDuration: number;

  if (win) {
    await SlotMachines.updateAsync(slot_id, {
      $set: {
        status: 'win-normal',
        'player.money': player.money - slotMachine.cost + win_amount,
      },
    });
    playerGiveMoney({
      playerId: player_id,
      money: win_amount,
    });

    const trigger = getAutotextWinTriggerForPayout(payout_multiplier);
    sendAutoText({
      trigger,
      playerId: player_id,
      interactivePayload: getSlotRespinInteractive(slotMachine._id),
      templateVars: {
        slot_name: slotMachine.name,
        slot_cost: slotMachine.cost.toString(),
        slot_payout: win_amount.toString(),
        slot_result: result.join('-'),
      },
    });
    resultScreenDuration = 7;
  } else {
    await SlotMachines.updateAsync(slot_id, { $set: { status: 'lose' } });
    sendAutoText({
      trigger: 'SLOT_LOSE',
      playerId: player_id,
      interactivePayload: getSlotRespinInteractive(slotMachine._id),
      templateVars: {
        slot_name: slotMachine.name,
        slot_cost: slotMachine.cost.toString(),
        slot_result: result.join('-'),
      },
    });
    resultScreenDuration = 4;
  }

  try {
    await throwIfCancelledTimeout(slot_id, resultScreenDuration);
  } catch (error) {
    if (error === TimeoutError) return;
    throw error;
  }

  await SlotMachines.updateAsync(slot_id, {
    $set: { status: 'available' },
    $unset: { player: 1, win_amount: 1, result: 1 },
  });
};
