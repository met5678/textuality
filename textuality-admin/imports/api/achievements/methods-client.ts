import { Meteor } from 'meteor/meteor';

import Players from '/imports/api/players';
import { InText } from '/imports/schemas/inText';

import './methods-client/achievements.tryUnlock';
import { tryUnlockAchievement } from './methods-client/achievements.tryUnlock';

Meteor.methods({
  'achievements.checkAfterInText': async (inText: InText) => {
    const playerId = inText.player;
    const player = await Players.findOneAsync(playerId);
    if (!player) return;

    if (player.status === 'active') {
      tryUnlockAchievement({ playerId, trigger: 'JOINED' });
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
