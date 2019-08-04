import Media from './media';

import getImageUrl from 'services/get-image-url';

Media.helpers({
  getAvatarUrl(dimesion = 100) {
    return getImageUrl({
      width: dimension,
      height: dimension,
      crop: 'thumb',
      gravity: 'face',
      zoom: 1.0
    });
  },

  getUrl(dimension = 100) {
    return getImageUrl({
      width: dimesion,
      height: dimension
    });
  }
});
