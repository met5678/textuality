import { Meteor } from 'meteor/meteor';
import { onlyEmoji } from 'emoji-aware';

import Achievements from './achievements';
import AchievementUnlocks from '/imports/api/achievementUnlocks';
import Players from '/imports/api/players';
import Media from '/imports/api/media';
import Events from '/imports/api/events';
import { Achievement } from '/imports/schemas/achievement';
import { InText } from '/imports/schemas/inText';

Meteor.methods({
  'achievements.tryUnlock': ({
    trigger,
    trigger_detail_number,
    trigger_detail_string,
    playerId,
  }) => {
    const achievementQuery: Partial<Achievement> = {
      event: Events.currentId()!,
      trigger,
    };
    typeof trigger_detail_number === 'number' &&
      (achievementQuery.trigger_detail_number = trigger_detail_number);
    typeof trigger_detail_string === 'string' &&
      (achievementQuery.trigger_detail_string = trigger_detail_string);

    const achievements = Achievements.find(achievementQuery).fetch();

    let earnedAchievement = false;
    if (achievements.length) {
      const player = Players.findOne(playerId);
      if (!player) return;
      const playerAchievements = AchievementUnlocks.find(
        { event: Events.currentId(), player: playerId },
        { fields: { achievement: 1 } },
      ).map((unlock) => unlock.achievement);

      achievements
        .filter((achievement) => !playerAchievements.includes(achievement._id))
        .forEach((achievement, i) => {
          AchievementUnlocks.insert({
            event: Events.currentId(),
            achievement: achievement._id,
            name: achievement.name,
            time: new Date(),
            player: playerId,
            alias: player.alias,
            avatar: player.avatar,
            numAchievements: playerAchievements.length + 1 + i,
          });
          Achievements.update(achievement._id!, { $inc: { earned: 1 } });
          Players.update(playerId, { $inc: { numAchievements: 1 } });

          if (achievement.money_award) {
            Meteor.call('players.giveMoney', {
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

          if (achievement.player_text?.trim()) {
            Meteor.call('autoTexts.sendCustom', {
              playerText: achievement.player_text,
              playerId,
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
  },

  'achievements.checkAfterInText': (inText: InText) => {
    const playerId = inText.player;
    const player = Players.findOne(playerId);
    if (!player) return;

    if (player.status === 'active') {
      Meteor.call('achievements.tryUnlock', { playerId, trigger: 'JOINED' });
    }

    // if (['feed', 'mediaOnly'].includes(inText.purpose)) {
    //   if (player.feedTextsSent) {
    //     Meteor.call('achievements.tryUnlock', {
    //       playerId,
    //       trigger: 'N_TEXTS_SENT',
    //       trigger_detail_number: player.feedTextsSent,
    //     });
    //   }

    //   if (player.feedMediaSent) {
    //     Meteor.call('achievements.tryUnlock', {
    //       playerId,
    //       trigger: 'N_PICTURES_SENT',
    //       triggerDetail: player.feedMediaSent,
    //     });
    //   }

    //   if (inText.media) {
    //     const media = Media.findOne(inText.media);
    //     if (media.purpose === 'feed' && media.faces.length >= 2) {
    //       Meteor.call('achievements.tryUnlock', {
    //         playerId,
    //         trigger: 'PICTURE_MULTI_FACES',
    //       });
    //     }
    //   }

    //   if (inText.body && onlyEmoji(inText.body).length) {
    //     Meteor.call('achievements.tryUnlock', {
    //       playerId,
    //       trigger: 'EMOJIS_IN_TEXT',
    //     });
    //   }
    // }
  },
});
