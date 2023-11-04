import AchievementUnlocks from './achievementUnlocks';

import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';

AchievementUnlocks.helpers({
  getAvatarUrl(dimension = 400) {
    return getImageUrl(this.avatar, {
      width: dimension,
      height: dimension,
      crop: 'thumb',
      gravity: 'face',
      zoom: 0.75,
    });
  },
});
