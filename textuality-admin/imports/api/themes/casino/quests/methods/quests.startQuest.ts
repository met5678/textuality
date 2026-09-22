import Quests from '../quests';
import Players from '/imports/api/players';
import { QuestId } from '/imports/schemas/quest';
import { PlayerId } from '/imports/schemas/player';
import { sendCustomAutoText } from '/imports/api/autoTexts/methods/autoTexts.sendCustom';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';

export const startQuest = async ({
  questId,
  playerId,
}: {
  questId: QuestId;
  playerId: PlayerId;
}) => {
  const quest = await Quests.findOneAsync(questId);
  if (!quest) return;

  await Players.updateAsync(playerId, {
    $push: { quests: { id: questId, complete: false, cheated: false } },
  });
  await Quests.updateAsync(questId, { $inc: { num_assigned: 1 } });

  sendCustomAutoText({
    playerText: quest.start_text,
    playerId,
    mediaUrl: quest.start_text_image ?? undefined,
    templateVars: {
      quest_name: quest.name,
    },
  });
};

export const startQuestMethod = getWrappedServerMethod(
  'quests.startQuest',
  startQuest,
);
