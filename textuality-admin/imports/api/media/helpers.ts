import Media from './media';

import { getImageUrl } from '/imports/services/cloudinary';

Media.helpers({
  getAvatarUrl(dimension = 100) {
    return getImageUrl(this._id, {
      width: dimension,
      height: dimension,
      crop: 'thumb',
      gravity: 'face',
      zoom: 1.1,
    });
  },

  getUrl(width, height) {
    if (!height) height = width;
    return getImageUrl(this._id, {
      width: width,
      height: height,
      crop: 'fit',
    });
  },

  getFeedUrl() {
    if (this.isPortrait()) {
      return getImageUrl(this._id, {
        width: 800,
        height: 800,
        crop: 'lfill',
        gravity: 'faces',
      });
    } else {
      return getImageUrl(this._id, {
        width: 800,
        height: 800,
        crop: 'lfill',
      });
    }
  },

  ratio() {
    return this.height / this.width;
  },

  isSquare() {
    return this.ratio() >= 0.9 && this.ratio() <= 1.1;
  },

  isPortrait() {
    return this.ratio() > 1.1;
  },

  isLandscape() {
    return this.ratio() < 0.9;
  },
});
