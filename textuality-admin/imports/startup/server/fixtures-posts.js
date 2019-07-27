import Posts from 'api/posts';

if (!Posts.findOne()) {
  Posts.insert({
    _id: 'NzRRmNjMpi6nxiNxC',
    week: -1,
    season: '11',
    conditions: {
      playerState: 'active'
    },
    prompt: 'Oh heyyyy!',
    subText:
      "I've got nothing for you right now, kitty girl. Order some food. Meditate. Something good will come of it, I promise.",
    showBallot: false,
    showBench: true,
    dialog: []
  });
}
