import Players from './players';
import Events from 'api/events';
import AchievementUnlocks from 'api/achievementUnlocks';

import { getImageUrl } from 'services/cloudinary';

Players.helpers({
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
