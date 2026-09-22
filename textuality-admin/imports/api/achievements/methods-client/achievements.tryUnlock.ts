import { Meteor } from 'meteor/meteor';
import AchievementUnlocks from '../../achievementUnlocks';
import Events from '../../events';
import Players from '../../players';
import { powerupsGeneratePowerup } from '../../themes/derby/powerups/methods/powerups.generatePowerup';
import { raceAwardLogicClue } from '../../themes/derby/race/logic-clues/races.awardLogicClue';
import Achievements from '../achievements';
import { Achievement, AchievementTrigger } from '/imports/schemas/achievement';
import { PlayerId } from '/imports/schemas/player';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';
import { playerGiveMoney } from '../../players/methods/players.giveMoney';
import { sendCustomAutoText } from '../../autoTexts/methods/autoTexts.sendCustom';

type UnlockAchievementArgs = {
  trigger: AchievementTrigger;
  trigger_detail_number?: number;
  trigger_detail_string?: string;
  playerId: PlayerId;
};

export const tryUnlockAchievement = async ({
  trigger,
  trigger_detail_number,
  trigger_detail_string,
  playerId,
}: UnlockAchievementArgs) => {
  const eventId = await Events.currentIdOrThrowAsync();
  const achievementQuery: Partial<Achievement> = {
    event: eventId,
    trigger,
  };
  typeof trigger_detail_number === 'number' &&
    (achievementQuery.trigger_detail_number = trigger_detail_number);
  typeof trigger_detail_string === 'string' &&
    (achievementQuery.trigger_detail_string = trigger_detail_string);

  const achievements = await Achievements.find(achievementQuery).fetchAsync();

  let earnedAchievement = false;
  if (achievements.length) {
    const player = await Players.findOneAsync(playerId);
    if (!player) return;
    const playerAchievements = await AchievementUnlocks.find(
      { event: eventId, player: playerId },
      { fields: { achievement: 1 } },
    ).mapAsync((unlock) => unlock.achievement);

    achievements
      .filter((achievement) => !playerAchievements.includes(achievement._id))
      .forEach((achievement, i) => {
        AchievementUnlocks.insertAsync({
          event: eventId,
          achievement: achievement._id,
          name: achievement.name,
          time: new Date(),
          player: playerId,
          alias: player.alias,
          avatar: player.avatar!,
          numAchievements: playerAchievements.length + 1 + i,
        });
        Achievements.updateAsync(achievement._id!, { $inc: { earned: 1 } });
        Players.updateAsync(playerId, { $inc: { numAchievements: 1 } });

        if (achievement.money_award) {
          playerGiveMoney({
            playerId: player._id,
            money: achievement.money_award,
          });
          player.money += achievement.money_award;
        }

        if (achievement.quest_award_type !== 'NONE') {
          Meteor.call('quests.startQuestOfType', {
            playerId: player._id,
            type: achievement.quest_award_type,
          });
        }

        if (achievement.derby_award !== 'NONE') {
          if (achievement.derby_award === 'HORSE_POWERUP') {
            powerupsGeneratePowerup(player._id);
          }
          if (achievement.derby_award === 'RACE_RESULT_LOGIC') {
            raceAwardLogicClue(player._id);
          }
        }

        if (achievement.player_text?.trim()) {
          sendCustomAutoText({
            playerText: achievement.player_text,
            playerId,
            mediaUrl: achievement.player_text_image ?? undefined,
            source: 'achievement',
            templateVars: {
              money_award: achievement.money_award,
            },
          });
        }
        earnedAchievement = true;
      });
    return earnedAchievement;
  }
};

export const tryUnlockAchievementMethod = getWrappedServerMethod(
  'achievements.tryUnlock',
  tryUnlockAchievement,
);
