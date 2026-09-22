import { Meteor } from 'meteor/meteor';
import Quests from '../quests';
import Events from '/imports/api/events';
import Players from '/imports/api/players';
import { QuestType } from '/imports/schemas/quest';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';

export const startQuestOfType = async ({
  playerId,
  type,
}: {
  playerId: string;
  type: QuestType;
}) => {
  const eventId = await Events.currentIdAsync();
  if (!eventId) return;

  const player = await Players.findOneAsync(playerId, {
    fields: { quests: 1 },
  });
  if (!player) return;
  const assignedQuests = player.quests.map((quests) => quests.id);
  const questsOfType = await Quests.find({ type, event: eventId }).fetchAsync();
  let availableQuests = questsOfType.filter(
    (quest) => !assignedQuests.includes(quest._id!),
  );

  if (availableQuests.length === 0 && type === 'HACKER_TASK') {
    Meteor.call('quests.startQuestOfType', { playerId, type: 'HACKER_SLOT' });
    return;
  }

  if (availableQuests.length === 0) {
    const trigger =
      type === 'HACKER_TASK' ? 'QUESTS_NO_TASKS_LEFT' : 'QUESTS_NO_SLOTS_LEFT';
    sendAutoText({
      trigger,
      playerId,
    });
    return;
  }

  const quest =
    availableQuests[Math.floor(Math.random() * availableQuests.length)];

  Meteor.call('quests.startQuest', { questId: quest._id!, playerId });
};

export const startQuestOfTypeMethod = getWrappedServerMethod(
  'quests.startQuestOfType',
  startQuestOfType,
);
