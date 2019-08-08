import InTexts from './inTexts';

import getImageUrl from 'services/get-image-url';

InTexts.helpers({
  getAvatarUrl(dimension = 100) {
    return getImageUrl(this.avatar, {
      width: dimension,
      height: dimension,
      crop: 'thumb',
      gravity: 'face',
      zoom: 1.1
    });
  }
});
