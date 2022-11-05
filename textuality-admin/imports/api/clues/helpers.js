import Clues from './clues';

Clues.helpers({
  getCardUrl() {
    return Meteor.absoluteUrl(`clue-cards/${this.type}/${this.shortName}.png`, {
      rootUrl: 'https://textuality.meteorapp.com/',
    });
  },

  getRevealImageUrl() {
    const ext = this.type === 'room' ? 'jpg' : 'png';
    return `/reveal-images/${this.type}/${this.shortName}.${ext}`;
  },
});
