import MissionPairings from './missionPairings';

import getImageUrl from 'services/get-image-url';

MissionPairings.helpers({
  getAvatarUrlA(dimension = 400) {
    return getImageUrl(this.avatarA, {
      width: dimension,
      height: dimension,
      crop: 'thumb',
      gravity: 'face',
      zoom: 0.75
    });
  },

  getAvatarUrlB(dimension = 400) {
    return getImageUrl(this.avatarB, {
      width: dimension,
      height: dimension,
      crop: 'thumb',
      gravity: 'face',
      zoom: 0.75
    });
  }
});
