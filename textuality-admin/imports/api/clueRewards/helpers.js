import ClueRewards from './clueRewards';

ClueRewards.helpers({
  getCardUrl() {
    return Meteor.absoluteUrl(
      `clue-cards/${this.clueType}/${this.clueShortName}.png`,
      {
        rootUrl: 'https://textuality.meteorapp.com/',
      }
    );
  },
});
