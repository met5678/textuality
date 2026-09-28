import Quests from "../quests";
import checkSlotSequence from "../slot-quest/check-slot-sequence";
import Events from "/imports/api/events";
import Players from "/imports/api/players";
import { PlayerId } from "/imports/schemas/player";
import { QuestId } from "/imports/schemas/quest";
import { SlotMachineId } from "/imports/schemas/slotMachine";

type CheckForHackerSpinArgs = {
  player_id: PlayerId;
  slot_id: SlotMachineId;
};

type CheckForHackerSpinReturn = {
  hackerSpin: boolean;
  hackerWin: boolean;
  quest_id?: QuestId;
}

export const checkForHackerSpinQuest = async ({
  player_id,
  slot_id,
}: CheckForHackerSpinArgs): Promise<CheckForHackerSpinReturn> => {
  const player = await Players.findOneAsync(player_id, {
    fields: { quests: 1, slot_spins: 1 },
  });
  if (!player) {
    return { hackerSpin: false, hackerWin: false };
  }

  const questIds = player.quests
    .filter((quest) => !quest.complete)
    .map((quest) => quest.id);

  const activeSlotQuests = await Quests.find({
    _id: { $in: questIds },
    type: 'HACKER_SLOT',
    event: await Events.currentIdOrThrowAsync(),
  }).fetchAsync();

  if (activeSlotQuests.length === 0)
    return { hackerSpin: false, hackerWin: false };

  const playerSpins = [...player.slot_spins, slot_id];

  const unlockStatuses = activeSlotQuests.map((slotQuest) => {
    const unlockSequence = slotQuest.slot_quest!.slot_sequence;

    return {
      quest: slotQuest,
      status: checkSlotSequence(unlockSequence, playerSpins),
    };
  });

  if (
    unlockStatuses.every((unlockStatus) => unlockStatus.status === 'NONE')
  ) {
    return { hackerSpin: false, hackerWin: false };
  }

  if (
    unlockStatuses.some((unlockStatus) => unlockStatus.status === 'COMPLETE')
  ) {
    const winningQuest = unlockStatuses.find(
      (unlockStatus) => unlockStatus.status === 'COMPLETE',
    )!.quest;
    return { hackerSpin: true, hackerWin: true, quest_id: winningQuest._id };
  }

  return { hackerSpin: true, hackerWin: false };
};
