import Quests from '../quests';
import { startQuestOfType } from './quests.startQuestOfType';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import Players from '/imports/api/players';
import { playerGiveMoney } from '/imports/api/players/methods/players.giveMoney';
import { PlayerId } from '/imports/schemas/player';
import { QuestId } from '/imports/schemas/quest';

type CompleteQuestArgs = {
  questId: QuestId;
  playerId: PlayerId;
  cheated: boolean;
};

export const completeQuest = async ({
  questId,
  playerId,
  cheated = false,
}: CompleteQuestArgs) => {
  const [player, quest] = await Promise.all([
    Players.findOneAsync(playerId),
    Quests.findOneAsync(questId),
  ]);
  if (!player) throw new Error('No player found');
  if (!quest) throw new Error('No quest found');

  const playerQuests = player.quests;
  if (cheated)
    playerQuests.push({ id: questId, complete: true, cheated: true });

  const newQuests = player.quests.map((playerQuest) => {
    if (playerQuest.id !== quest._id!) return playerQuest;
    return { ...playerQuest, complete: true, cheated };
  });

  await Promise.all([
    Players.updateAsync(playerId, { $set: { quests: newQuests } }),
    Quests.updateAsync(questId, { $inc: { num_completed: 1 } }),
  ]);

  if (quest.type === 'HACKER_TASK') {
    await startQuestOfType({ playerId, type: 'HACKER_SLOT' });
  } else if (quest.type === 'HACKER_SLOT') {
    await playerGiveMoney({
      playerId,
      money: quest.slot_quest?.win_amount ?? 0,
    });
    void sendAutoText({
      trigger: 'SLOT_WIN_HACKER',
      playerId,
      templateVars: {
        money_award: quest.slot_quest?.win_amount ?? 0,
      },
    });
  }

  return quest;
};
