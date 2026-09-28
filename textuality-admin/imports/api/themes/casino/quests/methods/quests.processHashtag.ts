import Quests from "../quests";
import Events from "/imports/api/events";
import Players from "/imports/api/players";
import { PlayerId } from "/imports/schemas/player";
import { completeQuest } from "./quests.completeQuest";

type ProcessQuestHashtagArgs = {
  playerId: PlayerId;
  hashtag: string;
}

export const processQuestHashtag = async ({ playerId, hashtag }: ProcessQuestHashtagArgs) => {
  const matchingQuests = Quests.find({
    event: await Events.currentIdOrThrowAsync(),
    type: 'HACKER_TASK',
    'task_quest.hashtag': hashtag,
  }).fetch();

  if (matchingQuests.length === 0) return false;
  const player = await Players.findOneAsync(playerId, { fields: { quests: 1 } });
  if (!player) return false;

  const matchingQuest = matchingQuests[0];
  const playerQuest = player.quests.find(
    (quest) => quest.id === matchingQuest._id,
  );

  await completeQuest({
    questId: matchingQuest._id,
    playerId,
    cheated: !playerQuest,
  });

  return true;
}
