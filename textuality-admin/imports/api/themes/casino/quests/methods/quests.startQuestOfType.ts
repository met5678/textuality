import Quests from '../quests';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import Events from '/imports/api/events';
import Players from '/imports/api/players';
import { startQuest } from '/imports/api/themes/casino/quests/methods/quests.startQuest';
import { QuestType } from '/imports/schemas/quest';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';

export const startQuestOfType = async ({
  playerId,
  type,
}: {
  playerId: string;
  type: QuestType;
}) => {
  const eventId = await Events.currentIdOrThrowAsync();

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
    await startQuestOfType({ playerId, type: 'HACKER_SLOT' });
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

  await startQuest({
    playerId,
    questId: quest._id,
  });
};

export const startQuestOfTypeMethod = getWrappedServerMethod(
  'quests.startQuestOfType',
  startQuestOfType,
);
