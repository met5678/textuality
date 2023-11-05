import { onlyEmoji, withoutEmoji } from 'emoji-aware';

import InTexts from './inTexts';

import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';

InTexts.helpers({
  getAvatarUrl(dimension = 100, zoom = 1.1) {
    if (!this.avatar) return '';
    return getImageUrl(this.avatar, {
      width: dimension,
      height: dimension,
      crop: 'thumb',
      gravity: 'face',
      zoom,
    });
  },

  hasEmoji() {
    return this.body && onlyEmoji(this.body).length;
  },

  bigEmojiOnFeed() {
    return (
      this.body &&
      this.body.length < 12 &&
      withoutEmoji(this.body).every((str: string) => str === ' ')
    );
  },
});
