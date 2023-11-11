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
import { QuestType } from '/imports/schemas/quest';
import Quests from './quests';
import checkSlotSequence from './slot-quest/check-slot-sequence';

// Once a spin starts, it'll need to go through a process:
//

Meteor.methods({
  'quests.processHashtag': ({ playerId, hashtag }) => {
    const matchingQuests = Quests.find({
      event: Events.currentId()!,
      type: 'HACKER_TASK',
      'task_quest.hashtag': hashtag,
    }).fetch();

    if (matchingQuests.length === 0) return false;
    const player = Players.findOne(playerId, { fields: { quests: 1 } });
    if (!player) return false;

    const matchingQuest = matchingQuests[0];
    const playerQuest = player.quests.find(
      (quest) => quest.id === matchingQuest._id,
    );
    Meteor.call('quests.completeQuest', {
      questId: matchingQuest._id,
      playerId,
      cheated: !playerQuest,
    });

    return true;
  },

  'quests.startQuestOfType': ({
    playerId,
    type,
  }: {
    playerId: string;
    type: QuestType;
  }) => {
    const player = Players.findOne(playerId, { fields: { quests: 1 } });
    if (!player) return;
    const assignedQuests = player.quests.map((quests) => quests.id);
    const questsOfType = Quests.find({ type }).fetch();
    let availableQuests = questsOfType.filter(
      (quest) => !assignedQuests.includes(quest._id!),
    );

    if (availableQuests.length === 0 && type === 'HACKER_TASK') {
      Meteor.call('quests.startQuestOfType', { playerId, type: 'HACKER_SLOT' });
      return;
    }

    if (availableQuests.length === 0) {
      const trigger =
        type === 'HACKER_TASK'
          ? 'QUESTS_NO_TASKS_LEFT'
          : 'QUESTS_NO_SLOTS_LEFT';
      Meteor.call('autoTexts.send', {
        trigger,
        playerId,
      });
      return;
    }

    const quest =
      availableQuests[Math.floor(Math.random() * availableQuests.length)];

    Meteor.call('quests.startQuest', { questId: quest._id!, playerId });
  },

  'quests.startQuest': ({ questId, playerId }) => {
    const quest = Quests.findOne(questId);
    if (!quest) return;

    Players.update(playerId, {
      $push: { quests: { id: questId, complete: false, cheated: false } },
    });
    Quests.update(questId, { $inc: { num_assigned: 1 } });

    Meteor.call('autoTexts.sendCustom', {
      playerText: quest.start_text,
      playerId,
      mediaUrl: quest.start_text_image ?? undefined,
      templateVars: {
        quest_name: quest.name,
      },
    });
  },

  'quests.completeQuest': ({ questId, playerId, cheated = false }) => {
    const player = Players.findOne(playerId);
    const quest = Quests.findOne(questId);

    if (!player || !quest) return;

    const playerQuests = player.quests;
    if (cheated)
      playerQuests.push({ id: questId, complete: true, cheated: true });

    const newQuests = player.quests.map((playerQuest) => {
      if (playerQuest.id !== quest._id!) return playerQuest;
      return { ...playerQuest, complete: true, cheated };
    });
    Players.update(playerId, { $set: { quests: newQuests } });
    Quests.update(questId, { $inc: { num_completed: 1 } });

    if (quest.type === 'HACKER_TASK') {
      Meteor.call('quests.startQuestOfType', { playerId, type: 'HACKER_SLOT' });
    } else if (quest.type === 'HACKER_SLOT') {
      Meteor.call('players.giveMoney', {
        playerId,
        money: quest.slot_quest?.win_amount ?? 0,
      });
      Meteor.call('autoTexts.send', {
        trigger: 'SLOT_WIN_HACKER',
        playerId,
        templateVars: {
          money_award: quest.slot_quest?.win_amount ?? 0,
        },
      });
    }

    return quest;
  },

  'quests.checkForHackerSpin': ({
    player_id,
    slot_id,
  }): { hackerSpin: boolean; hackerWin: boolean; quest_id?: string } => {
    const player = Players.findOne(player_id, {
      fields: { quests: 1, slot_spins: 1 },
    });
    if (!player) {
      return { hackerSpin: false, hackerWin: false };
    }

    const questIds = player.quests
      .filter((quest) => !quest.complete)
      .map((quest) => quest.id);

    const activeSlotQuests = Quests.find({
      _id: { $in: questIds },
      type: 'HACKER_SLOT',
    }).fetch();
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
  },
});
