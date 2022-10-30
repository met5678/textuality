import { Meteor } from 'meteor/meteor';
import { onlyEmoji } from 'emoji-aware';

import Achievements from './achievements';
import AchievementUnlocks from 'api/achievementUnlocks';
import Players from 'api/players';
import Media from 'api/media';
import Events from 'api/events';
import InTexts from 'api/inTexts';

Meteor.methods({
  'achievements.tryUnlock': ({ trigger, triggerDetail, playerId }) => {
    const achievementQuery = {
      event: Events.currentId(),
      trigger
    };
    if (triggerDetail) {
      if (typeof triggerDetail === 'number') {
        achievementQuery.triggerDetail = { $lte: triggerDetail };
      } else {
        achievementQuery.triggerDetail = triggerDetail;
      }
    }

    const achievements = Achievements.find(achievementQuery).fetch();

    if (achievements.length) {
      const player = Players.findOne(playerId);
      const playerAchievements = AchievementUnlocks.find(
        { event: Events.currentId(), player: playerId },
        { fields: { achievement: 1 } }
      ).map(unlock => unlock.achievement);

      achievements
        .filter(achievement => !playerAchievements.includes(achievement._id))
        .forEach((achievement, i) => {
          AchievementUnlocks.insert({
            event: Events.currentId(),
            achievement: achievement._id,
            name: achievement.name,
            time: new Date(),
            player: playerId,
            alias: player.alias,
            avatar: player.avatar,
            numAchievements: playerAchievements.length + 1 + i
          });
          Achievements.update(achievement._id, { $inc: { earned: 1 } });
          Players.update(playerId, { $inc: { numAchievements: 1 } });
          Meteor.call('autoTexts.send', {
            trigger: 'ACHIEVEMENT_UNLOCK',
            playerId,
            templateVars: {
              name: achievement.name,
              numAchievements: playerAchievements.length + 1 + i,
              totalAchievements: Achievements.find().count(),
              number: achievement.number,
              text: achievement.playerText
            },
            source: 'achievement'
          });
        });
    }
  },

  'achievements.checkAfterInText': inText => {
    const playerId = inText.player;
    const player = Players.findOne(playerId);

    if (player.status === 'active') {
      Meteor.call('achievements.tryUnlock', { playerId, trigger: 'JOINED' });
    }

    if (['feed', 'mediaOnly'].includes(inText.purpose)) {
      if (player.feedTextsSent) {
        Meteor.call('achievements.tryUnlock', {
          playerId,
          trigger: 'N_TEXTS_SENT',
          triggerDetail: player.feedTextsSent
        });
      }

      if (player.feedMediaSent) {
        Meteor.call('achievements.tryUnlock', {
          playerId,
          trigger: 'N_PICTURES_SENT',
          triggerDetail: player.feedMediaSent
        });
      }

      if (inText.media) {
        const media = Media.findOne(inText.media);
        if (media.purpose === 'feed' && media.faces.length >= 2) {
          Meteor.call('achievements.tryUnlock', {
            playerId,
            trigger: 'PICTURE_MULTI_FACES'
          });
        }
      }

      if (inText.body && onlyEmoji(inText.body).length) {
        Meteor.call('achievements.tryUnlock', {
          playerId,
          trigger: 'EMOJIS_IN_TEXT'
        });
      }
    }
  }
});
