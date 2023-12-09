import Media from './media';

import {
  getImageUrl,
  getVideoUrl,
} from '/imports/services/cloudinary/cloudinary-geturl';

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
    if (this.content_type === 'image') {
      return getImageUrl(this._id, {
        width: width,
        height: height,
        crop: 'fit',
        gravity: 'faces',
      });
    } else {
      return getVideoUrl(this._id, {
        width: width,
        height: height,
      });
    }
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
