import AchievementUnlocks from './achievementUnlocks';

import { getImageUrl } from 'services/cloudinary';

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
