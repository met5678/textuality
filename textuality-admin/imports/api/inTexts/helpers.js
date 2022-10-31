import { onlyEmoji, withoutEmoji } from 'emoji-aware';

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
  },

  hasEmoji() {
    return this.body && onlyEmoji(this.body).length;
  },

  bigEmojiOnFeed() {
    return (
      this.body &&
      this.body.length < 12 &&
      withoutEmoji(this.body).every(str => str === ' ')
    );
  }
});
