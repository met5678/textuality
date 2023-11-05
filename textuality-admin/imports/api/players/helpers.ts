import Players from './players';

import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';

Players.helpers({
  getAvatarUrl(dimension = 400, zoom = 1) {
    if (!this.avatar) return null;

    return getImageUrl(this.avatar, {
      width: dimension,
      height: dimension,
      crop: 'thumb',
      gravity: 'face',
      zoom,
    });
  },
});
